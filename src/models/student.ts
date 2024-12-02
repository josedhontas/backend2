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

const getSankeyData = async (
  period_init: string,
  period_end: string
): Promise<{
  nodes: { name: string }[];
  links: { source: number; target: number; value: number }[];
  periods: string[];
}> => {
  const sankeyQuery = `
    SELECT 
      curriculums.initial_period AS period, 
      courses.name AS course_name, 
      COUNT(students.id) AS number_of_students
    FROM 
      curriculums
    JOIN 
      students ON curriculums.student_id = students.id
    JOIN 
      courses ON curriculums.course_id = courses.id
    WHERE 
      curriculums.initial_period BETWEEN ? AND ?
    GROUP BY 
      curriculums.initial_period, courses.name
    ORDER BY 
      curriculums.initial_period, courses.name;
  `;

  const result = await dbQuery(sankeyQuery, [period_init, period_end]);

  const nodes: { [key: string]: number } = {};
  const rawLinks: { source: number; target: number; value: number }[] = [];
  const periodsSet = new Set<string>();

  result.forEach((row: { period: string; course_name: string; number_of_students: number }) => {
    const { period, course_name, number_of_students } = row;
    periodsSet.add(period);

    const courseNodeName = `${course_name} (${period})`;
    if (!(courseNodeName in nodes)) {
      nodes[courseNodeName] = Object.keys(nodes).length;
    }

    const evasionNodeName = `Evasão (${period})`;
    if (!(evasionNodeName in nodes)) {
      nodes[evasionNodeName] = Object.keys(nodes).length;
    }

    rawLinks.push({
      source: nodes[courseNodeName],
      target: nodes[evasionNodeName],
      value: number_of_students,
    });
  });

  const formattedNodes = Object.keys(nodes).map(name => ({ name }));

  const groupedLinks = rawLinks.reduce((acc, link) => {
    const existingLink = acc.find(
      (l) => l.source === link.source && l.target === link.target
    );
    if (existingLink) {
      existingLink.value += link.value;
    } else {
      acc.push(link);
    }
    return acc;
  }, [] as { source: number; target: number; value: number }[]);

  const periods = Array.from(periodsSet).sort();

  return {
    nodes: formattedNodes,
    links: groupedLinks,
    periods,
  };
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
  getSankeyData,
};
