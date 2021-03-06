import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import { Headers, URLSearchParams } from '@angular/http';
import * as moment from 'moment';
import 'zone.js/dist/zone';
import { Lancamento } from '../core/model';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class LancamentoService {

  lancamentoUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: Http) { }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {

    const params = new URLSearchParams();
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AbW9uZXkuY29tOmFkbWlu');

    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }

    if (filtro.dataVencimentoFim) {
      params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }

    return this.http.get(`${this.lancamentoUrl}?resumo`, { headers, search: params })
      .toPromise()
      .then(response => {
        const responseJson = response.json();
        const lancamentos = responseJson.content;

        const resultado = {
          lancamentos: lancamentos,
          total: responseJson.totalElements
        };
        return resultado;
      });
    }

    excluir(codigo: number): Promise<void> {
      const headers = new Headers();
      headers.append('Authorization', 'Basic YWRtaW5AbW9uZXkuY29tOmFkbWlu');

      return this.http.delete(`${this.lancamentoUrl}/${codigo}`, { headers })
        .toPromise()
        .then(() => null);
    }

    adicionar(lancamento: Lancamento): Promise<Lancamento> {
      const headers = new Headers();
      headers.append('Authorization', 'Basic YWRtaW5AbW9uZXkuY29tOmFkbWlu');
      headers.append('Content-Type', 'application/json');

      return this.http.post(this.lancamentoUrl,
        JSON.stringify(lancamento), { headers })
        .toPromise()
        .then(response => response.json());

    }

    atualizar(lancamento: Lancamento): Promise<Lancamento> {
      const headers = new Headers();
      headers.append('Authorization', 'Basic YWRtaW5AbW9uZXkuY29tOmFkbWlu');
      headers.append('Content-Type', 'application/json');

      return this.http.put(`${this.lancamentoUrl}/${lancamento.codigo}`,
          JSON.stringify(lancamento), { headers })
        .toPromise()
        .then(response => {
          const lancamentoAlterado = response.json() as Lancamento;

          this.converterStringsParaDatas([lancamentoAlterado]);

          return lancamentoAlterado;
        });
    }

    buscarPorCodigo(codigo: number): Promise<Lancamento> {
      const headers = new Headers();
      headers.append('Authorization', 'Basic YWRtaW5AbW9uZXkuY29tOmFkbWlu');

      return this.http.get(`${this.lancamentoUrl}/${codigo}`, { headers })
        .toPromise()
        .then(response => {
          const lancamento = response.json() as Lancamento;
          this.converterStringsParaDatas([lancamento]);
          return lancamento;
        });
    }

    private converterStringsParaDatas(lancamentos: Lancamento[]) {
      for (const lancamento of lancamentos) {
        lancamento.dataVencimento = moment(lancamento.dataVencimento,
          'YYYY-MM-DD').toDate();

        if (lancamento.dataPagamento) {
          lancamento.dataPagamento = moment(lancamento.dataPagamento,
            'YYYY-MM-DD').toDate();
        }
      }
    }

}
