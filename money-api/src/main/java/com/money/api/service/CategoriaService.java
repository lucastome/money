package com.money.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.money.api.model.Categoria;
import com.money.api.repository.CategoriaRepository;

@Service
public class CategoriaService {

	@Autowired
	private CategoriaRepository categoriaRepository;

	public List<Categoria> findAll() {
		return this.categoriaRepository.findAll();
	}

	public Categoria save(Categoria categoria) {
		return this.categoriaRepository.save(categoria);
	}
	
	public Categoria findOne(Long codigo) {
		return this.categoriaRepository.findOne(codigo);
	}

}
