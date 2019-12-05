import { ErrorHandlerService } from './../../core/error-handler.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { PessoaFiltro, PessoaService } from './../pessoa.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  pessoas = [];
  filtro = new PessoaFiltro();
  totalRegistros = 0;
  @ViewChild('tabela') grid;

  constructor(private pessoaService: PessoaService,
              private messageService: MessageService,
              private confirmation: ConfirmationService,
              private errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.pessoaService.pesquisar(this.filtro)
    .then(resultado => {
      this.totalRegistros = resultado.total;
      this.pessoas = resultado.pessoas;
    });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Deseja excluir ?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {

    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
        }
        this.messageService.add({severity: 'success', detail: 'Pessoa Excluida'});
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  mudarStatus(pessoa: any) {

    const ativo = !pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo, ativo).then(() => {

      const acao = ativo ? 'ativada(o)' : 'desativada(o)';
      pessoa.ativo = ativo;

      this.messageService.add({severity: 'success', detail: `${pessoa.nome} ${acao} com sucesso!`});
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

}
