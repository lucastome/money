package com.money.api.service;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.money.api.model.Lancamento;
import com.money.api.model.Pessoa;
import com.money.api.repository.LancamentoRepository;
import com.money.api.repository.PessoaRepository;
import com.money.api.repository.filter.LancamentoFilter;
import com.money.api.repository.projection.ResumoLancamento;
import com.money.api.service.exception.PessoaInexistenteOuInativaException;

@Service
public class LancamentoService {

	@Autowired
	private PessoaRepository pessoaRepository;

	@Autowired
	private LancamentoRepository lancamentoRepository;
	
	
	public Page<Lancamento> filtrar(LancamentoFilter lancamentoFilter, Pageable pageable) {
		return this.lancamentoRepository.filtrar(lancamentoFilter, pageable);
	}
	
	public Page<ResumoLancamento> resumir(LancamentoFilter lancamentoFilter , Pageable pageable){ 
		return this.lancamentoRepository.resumir(lancamentoFilter, pageable);
	}
	
	public Lancamento findOne(Long codigo) {
		return this.lancamentoRepository.findOne(codigo);
	}

	public void delete(Long codigo) {
		this.lancamentoRepository.delete(codigo);
	}
	
	public Lancamento salvar(Lancamento lancamento) {
		this.validarPessoaLancamento(lancamento.getPessoa());
		return lancamentoRepository.save(lancamento);
	}

	public Lancamento atualizar(Long codigo, Lancamento lancamento) {

		Lancamento lancamentoSalvo = this.findOneLancamento(codigo);

		if (!lancamento.getPessoa().equals(lancamentoSalvo.getPessoa())) {
			this.validarPessoaLancamento(lancamento.getPessoa());
		}

		BeanUtils.copyProperties(lancamento, lancamentoSalvo, "codigo");

		return lancamentoRepository.save(lancamentoSalvo);
	}

	private void validarPessoaLancamento(Pessoa pessoa) {

		Pessoa pessoaRecuperada = null;

		if (pessoa.getCodigo() != null) {
			pessoaRecuperada = pessoaRepository.findOne(pessoa.getCodigo());
		}

		if (pessoaRecuperada == null || pessoaRecuperada.isInativo()) {
			throw new PessoaInexistenteOuInativaException();
		}
	}

	private Lancamento findOneLancamento(Long codigo) {
		Lancamento lancamentoSalvo = lancamentoRepository.findOne(codigo);
		if (lancamentoSalvo == null) {
			throw new IllegalArgumentException();
		}
		return lancamentoSalvo;
	}

}
