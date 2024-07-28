
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
  
function transformarFormato(dados: data3) {
    if (
      dados.APROVADO &&
      dados.REPROVADO &&
      dados.CANCELADO &&
      dados.TRANCADO
    ) {
      const aprovados = dados.APROVADO;
      const reprovados = dados.REPROVADO;
      const cancelados = dados.CANCELADO;
      const trancados = dados.TRANCADO;
      const novoFormato2: { periodo: string, Reprovados: number, Trancados: number, Cancelados: number, Aprovados: number, ReprovadosAbsoluto: number, TrancadosAbsoluto: number, CanceladosAbsoluto: number, AprovadosAbsoluto: number }[] = [];
  
      for (let i = 0; i < aprovados.length; i++) {
        reprovados[i] = reprovados[i] || {};
        trancados[i] = trancados[i] || {};
        cancelados[i] = cancelados[i] || {};
        aprovados[i] = aprovados[i] || {};
  
        const quantidadeReprovados = reprovados[i].quantidade || 0;
        const quantidadeTrancados = trancados[i].quantidade || 0;
        const quantidadeCancelados = cancelados[i].quantidade || 0;
        const quantidadeAprovados = aprovados[i].quantidade || 0;
  
        const valor_total = Number(quantidadeReprovados) + Number(quantidadeTrancados) + Number(quantidadeCancelados) + Number(quantidadeAprovados);
        const porcentagemReprovados = (Number(quantidadeReprovados) / valor_total) * 100;
        const porcentagemTrancados = (Number(quantidadeTrancados) / valor_total) * 100;
        const porcentagemCancelados = (Number(quantidadeCancelados) / valor_total) * 100;
        const porcentagemAprovados = (Number(quantidadeAprovados) / valor_total) * 100;
  
        novoFormato2.push({
          periodo: aprovados[i].period.toString(),
          Reprovados: Number(porcentagemReprovados.toFixed(2)),
          Trancados: Number(porcentagemTrancados.toFixed(2)),
          Cancelados: Number(porcentagemCancelados.toFixed(2)),
          Aprovados: Number(porcentagemAprovados.toFixed(2)),
          ReprovadosAbsoluto: Number(quantidadeReprovados),
          TrancadosAbsoluto: Number(quantidadeTrancados),
          AprovadosAbsoluto: Number(quantidadeAprovados),
          CanceladosAbsoluto: Number(quantidadeCancelados),
        });
      }
      return novoFormato2;
    } else {
      console.error("Alguma propriedade está faltando ou é undefined.");
      return [];
    }
  }

  export default transformarFormato;
  