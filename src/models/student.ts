import { dbQuery } from "../services/db";

export type Student = {
  id: number;
  name: string;
  birthday: string;
  birth_place: string;
  nationality: string;
  cpf: string;
};

type PendingWorkload = {
  media: number;
  PendingWorkload: number;
};

type Bolha = {
  media: number;
  initial_period: string;
  tam_bolha: number;
};

type BoxPlot = {
  minimo: number;
  maximo: number;
  media: number;
  q1: number;
  mediana: number;
  q3: number;
};

type ViolinPlot = {
  initial_period: string;
  avg_completion_time: number[];
};

const insertStudent = async (student: Student) => {
  await dbQuery(
    `INSERT INTO students(id, name, birthday, birth_place, nationality, cpf) VALUES(?, ?, ?, ?, ?, ?)`,
    [student.id, student.name, student.birthday, student.birth_place, student.nationality, student.cpf]
  );
};

const listStudents = async () => {
  const retorno = await dbQuery(`SELECT * FROM students`);
  return retorno as Student[];
};

const getStudent = async (id: number) => {
  const retorno = await dbQuery(`SELECT * FROM students WHERE id = ?`, [id]);
  return retorno[0] as Student | undefined;
};



const getWorkloadPending = async (course_id: number, period_init: string, period_end: string) => {
  const retorno = await dbQuery(
    `SELECT COALESCE(mc, 0) AS mc, (required_component_workload - fulfilled_component_workload) AS PendingWorkload FROM curriculums WHERE course_id = ? 
  AND initial_period BETWEEN ? AND ?
  ORDER BY initial_period`,
    [course_id, period_init, period_end]
  );
  return retorno as PendingWorkload[];
};

export const getCurriculumData = async (course_id: number, period_init: string, period_end: string) => {
  const retorno = await dbQuery(
    `SELECT mc AS media, initial_period, fulfilled_component_workload AS tam_bolha
  FROM curriculums
  WHERE course_id = ? 
  AND initial_period BETWEEN ? AND ?
  ORDER BY initial_period`,
    [course_id, period_init, period_end]
  );
  return retorno as Bolha[];
};

export const getBoxPlot = async (course_id: number): Promise<BoxPlot[]> => {
  const boxPlotQuery = `
    WITH ordered_grades AS (
        SELECT 
            grade,
            ROW_NUMBER() OVER (ORDER BY grade) AS row_num,
            COUNT(*) OVER () AS total_count
        FROM curricular_components cc
        WHERE cc.curriculum_id IN (
            SELECT id FROM curriculums WHERE course_id = ?
        )
    )
    SELECT 
        MIN(grade) AS minimo,
        MAX(grade) AS maximo,
        ROUND(AVG(grade), 2) AS media,
        MAX(CASE WHEN row_num = (total_count + 1) / 4 THEN grade END) AS q1,
        MAX(CASE WHEN row_num = (total_count + 1) / 2 THEN grade END) AS mediana,
        MAX(CASE WHEN row_num = (total_count + 1) * 3 / 4 THEN grade END) AS q3
    FROM ordered_grades;
  `;

  const retorno = await dbQuery(boxPlotQuery, [course_id]);
  return retorno as BoxPlot[];
};

const getViolinPlot = async (course_id: number, period_init: string, period_end: string): Promise<ViolinPlot[]> => {
  const retorno = await dbQuery(
    `SELECT 
    c.initial_period, 
    c.MC AS avg_completion_time
  FROM 
    curriculums c
  JOIN 
    courses cr ON c.course_id = cr.id
  WHERE 
    cr.id = ?
    AND c.initial_period BETWEEN ? AND ?
  ORDER BY 
    c.initial_period;`,
    [course_id, period_init, period_end]
  );

  const groupedData = retorno.reduce((acc, curr) => {
    const { initial_period, avg_completion_time } = curr;
    if (!acc[initial_period]) {
      acc[initial_period] = { initial_period, avg_completion_time: [] };
    }
    acc[initial_period].avg_completion_time.push(avg_completion_time);
    return acc;
  }, {});

  return Object.values(groupedData) as ViolinPlot[];
};

const updateStudent = async (student: Student) => {
  await dbQuery(
    `UPDATE students SET name = ?, birthday = ?, birth_place = ?, 
  nationality = ?, cpf = ? WHERE id = ?`,
    [student.name, student.birthday, student.birth_place, student.nationality, student.cpf, student.id]
  );
};

const deleteStudent = async (id: number) => {
  await dbQuery(`DELETE FROM students WHERE id = ?`, [id]);
};

export const getSankeyData = async (period_init: string, period_end: string) => {
  // Consulta SQL para obter os dados acumulados
  const query = `
SELECT 
    c.name AS course_name,
    cr.initial_period AS period,
    COUNT(CASE WHEN cr.initial_period IS NOT NULL THEN cr.id END) AS students_in,
    COUNT(CASE WHEN cr.leaving_date IS NOT NULL AND cr.leaving_reason = 'ABANDONO' THEN cr.id END) AS students_evaded,
    SUM(COUNT(CASE WHEN cr.initial_period IS NOT NULL THEN cr.id END)) 
        OVER (PARTITION BY c.name ORDER BY cr.initial_period) AS cumulative_students_in,
    SUM(COUNT(CASE WHEN cr.leaving_date IS NOT NULL AND cr.leaving_reason = 'ABANDONO' THEN cr.id END)) 
        OVER (PARTITION BY c.name ORDER BY cr.initial_period) AS cumulative_students_evaded
FROM 
    curriculums cr
JOIN 
    courses c ON cr.course_id = c.id
WHERE 
    cr.initial_period BETWEEN '2016.1' AND '2018.2'
GROUP BY 
    c.id, c.name, cr.initial_period
ORDER BY 
    c.name, cr.initial_period;

  `;

  // Executa a consulta
  const retorno = await dbQuery(query, [period_init, period_end]);

  // Organizando os dados para o gráfico Sankey
  const nodes: { name: string }[] = [];
  const links: { source: number; target: number; value: number }[] = [];
  const nodeIndices: { [key: string]: number } = {}; // Mapeamento de cursos para índices de nós
  let position = 0;

  // Itera sobre os dados para gerar nós e links
  for (const row of retorno) {
    const course_name = row.course_name;
    const cumulative_students_in = row.cumulative_students_in;

    // Adiciona o nó se ele ainda não foi adicionado
    if (!(course_name in nodeIndices)) {
      nodeIndices[course_name] = position;
      nodes.push({ name: course_name });
      position++;
    }

    // Cria links entre períodos consecutivos do mesmo curso
    const currentIndex = nodeIndices[course_name];
    if (links.length > 0 && currentIndex !== position - 1) {
      links.push({
        source: currentIndex,
        target: currentIndex + 1,
        value: cumulative_students_in,
      });
    }
  }

  // Retorna o formato esperado pelo gráfico Sankey
  return { nodes, links };
};



export const studentModel = {
  insertStudent,
  listStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getWorkloadPending,
  getCurriculumData,
  getBoxPlot,
  getViolinPlot,
  getSankeyData

};
