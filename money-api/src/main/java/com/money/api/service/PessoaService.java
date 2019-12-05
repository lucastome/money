package com.money.api.service;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.money.api.model.Pessoa;
import com.money.api.repository.PessoaRepository;

@Service
public class PessoaService {

	@Autowired
	private PessoaRepository pessoaRepository;
	
	public Page<Pessoa> findByNomeContaining(String nome, Pageable pageable) {
		return this.pessoaRepository.findByNomeContaining(nome, pageable);
	}

	public Pessoa save(Pessoa pessoa) {
		return this.pessoaRepository.save(pessoa);
	}

	public Pessoa findOne(Long codigo) {
		return this.pessoaRepository.findOne(codigo);
	}

	public void delete(Long codigo) {
		this.pessoaRepository.delete(codigo);
	}
	
	public Pessoa atualizar(Long codigo, Pessoa pessoa) {
		Pessoa pessoaSalva = buscarPessoaPeloCodigo(codigo);
		BeanUtils.copyProperties(pessoa, pessoaSalva, "codigo");// atualiza os dados de passoa salva com os dados de
																// pessoa ignorando o codigo
		return pessoaRepository.save(pessoaSalva);
	}

	public void atualizarPropriedadeAtivo(Long codigo, Boolean ativo) {

		Pessoa pessoaSalva = buscarPessoaPeloCodigo(codigo);
		pessoaSalva.setAtivo(ativo);
		pessoaRepository.save(pessoaSalva);
	}

	public Pessoa buscarPessoaPeloCodigo(Long codigo) {
		Pessoa pessoaSalva = pessoaRepository.findOne(codigo);

		if (pessoaSalva == null) {
			throw new EmptyResultDataAccessException(1);
		}
		return pessoaSalva;
	}

}
