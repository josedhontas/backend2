import { dbQuery } from "../services/db";
import { getCurriculumsID, getDisciplinesIdByCode } from "../services/functions";
import transformarFormato from "../support/transforma";

export type data1 = {
  period: string,
  nome_disciplina: string,
  situation: string,
  quantidade: number
}

type data2 = {
  period: string;
  [key: string]: string | number;

};

type data3 = {
  'APROVADO': data2[];
  'REPROVADO': data2[];
  'REP. FALTA': data2[];
  'REPROVADO POR MÉDIA E POR FALTAS': data2[];
  'CANCELADO': data2[];
  'TRANCADO': data2[];
  'DISPENSADO': data2[];
  [key: string]: data2[];
};

const Situations: Record<string, keyof data3> = {
  APROVADO: 'APROVADO',
  'REPROVADO POR MÉDIA E POR FALTAS': 'REPROVADO POR MÉDIA E POR FALTAS',
  REPROVADO: 'REPROVADO',
  'REP. FALTA': 'REP. FALTA',
  CANCELADO: 'CANCELADO',
  TRANCADO: 'TRANCADO',
  DISPENSADO: 'DISPENSADO',
};

export const getData = async (course_id: number, period_init: string, period_end: string, disciplines: string[]) => {
  const curriculums_id = await getCurriculumsID(course_id)
  const disciplines_id = await getDisciplinesIdByCode(disciplines)
  const retorno = await dbQuery(`SELECT cc.period, d.name AS nome_disciplina, cc.situation,
    COUNT(*) AS quantidade
  FROM
    curricular_components cc
  JOIN
    disciplines d ON cc.discipline_id = d.id
  JOIN
    curriculums c ON cc.curriculum_id = c.id
  WHERE
    cc.discipline_id IN (${disciplines_id?.toString()})
    AND cc.curriculum_id IN (${curriculums_id?.toString()})
    AND cc.period BETWEEN ? AND ?
  GROUP BY
    cc.period,
    d.name,
    cc.situation;`, [period_init, period_end])
  return retorno as data1[]
}

export const getDataByDiscipline = async (course_id: number, period_init: string, period_end: string, discipline: string[]) => {
  const retorno = await getData(course_id, period_init, period_end, discipline)
  var resultado: data3 = {
    'APROVADO': [],
    'REPROVADO': [],
    'REP. FALTA': [],
    'REPROVADO POR MÉDIA E POR FALTAS': [],
    'CANCELADO': [],
    'TRANCADO': [],
    'DISPENSADO': [],
  };

  let nome_disciplina: string;

  retorno.forEach((data) => {
    const situationKey = Object.keys(Situations).find((key) =>
      data.situation.toUpperCase().includes(key.toUpperCase())
    );

    if (situationKey) {
      nome_disciplina = data.nome_disciplina;
      const category = Situations[situationKey];
      const categoryArray = resultado[category];
      categoryArray.push({
        period: data.period,
        [data.nome_disciplina]: Number(data.quantidade) || 0,
        quantidade: data.quantidade
      });
    }
  });

  const keysWithValues = Object.keys(resultado).filter(situation => resultado[situation].length > 0);
  const keysWithoutValues = Object.keys(resultado).filter(situation => resultado[situation].length === 0);

  keysWithoutValues.forEach(emptyKey => {
    const nonEmptyKey = keysWithValues.find(nonEmptyKey => resultado[nonEmptyKey].length > 0);
    if (nonEmptyKey) {
      resultado[emptyKey] = resultado[nonEmptyKey].map(item => ({
        period: item.period,
        [nome_disciplina]: 0,
        quantidade: 0,
      }));
    } else {
      resultado[emptyKey] = [];
    }
  });

  const reprovedArray = resultado['REPROVADO'];

  ['REP. FALTA', 'REPROVADO POR MÉDIA E POR FALTAS'].forEach(situation => {
    resultado[situation].forEach(item => {
      const reprovedItem = resultado['REPROVADO'].find(reprovedItem => reprovedItem.period === item.period);

      if (reprovedItem) {
        reprovedItem[nome_disciplina] = ((reprovedItem[nome_disciplina] as number) || 0) + ((item[nome_disciplina] as number) || 0);
      } else {
        resultado['REPROVADO'].push({
          period: item.period,
          [nome_disciplina]: (item[nome_disciplina] as number) || 0,
          quantidade: (item[nome_disciplina] as number) || 0
        });
      }
    });
  });


  return transformarFormato(resultado);

}

export const grafico1Model = {
  getData,
  getDataByDiscipline
}
