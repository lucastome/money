import { LancamentoService } from './../lancamento.service';
import { FormControl } from '@angular/forms';
import { PessoaService } from './../../pessoas/pessoa.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { Component, OnInit } from '@angular/core';
import { Lancamento } from 'src/app/core/model';
import { MessageService } from 'primeng/components/common/messageservice';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    {label: 'Receita', value: 'RECEITA'},
    {label: 'Despesa', value: 'DESPESA'},
  ];

  categorias = [];
  pessoas = [];
  lancamento = new Lancamento();

  constructor (
    private categoriaService: CategoriaService,
    private errorHandler: ErrorHandlerService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit() {
    const codigoLancamento = this.route.snapshot.params['codigo'];
    this.title.setTitle('Novo Lancamento');
    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }
    this.carregarCategorias();
    this.carregarPessoas();
  }

  carregarLancamento (codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo).then(lancamento => {
      this.lancamento = lancamento;
      this.atualizarTituloAba();
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get isEdicao () {
    return Boolean(this.lancamento.codigo);
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias.map(c => {
          return {label: c.nome, value: c.codigo};
        });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    return this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas.map(p => {
          return {label: p.nome, value: p.codigo};
        });
      }).catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    if (this.isEdicao) {
      this.atualizarLancamento(form);
    } else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: FormControl) {
    return this.lancamentoService.adicionar(this.lancamento)
    .then(lancamento => {
      this.messageService.add({severity: 'success', detail: 'Lancamento adicionado com sucesso!'});
      this.router.navigate(['/lancamentos', lancamento.codigo]);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento(form: FormControl) {
    return this.lancamentoService.atualizar(this.lancamento)
    .then(lancamento => {
      this.lancamento = lancamento;
      this.messageService.add({severity: 'success', detail: 'Lancamento editado com sucesso!'});
      this.atualizarTituloAba();
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  novoLancamento(form: FormControl) {
    form.reset();
    setTimeout(function () {
      this.lancamento = new Lancamento();
    }.bind(this), 1);
    this.router.navigate(['lancamentos/novo']);
  }

  atualizarTituloAba () {
    this.title.setTitle(`Editando Lancamento: ${this.lancamento.descricao}`);
  }

}
