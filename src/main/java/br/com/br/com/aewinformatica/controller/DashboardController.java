package br.com.br.com.aewinformatica.controller;

import javax.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import br.com.br.com.aewinformatica.model.Animal;

@Controller
@RequestMapping("/")
public class DashboardController {

	@GetMapping
	public ModelAndView home(Animal animal) {
		
		ModelAndView mv = new ModelAndView("Dashboard");
		
		return mv;
	}
	@PostMapping
	public ModelAndView salvar(@Valid Animal animal) {
		
		System.out.println("Ele tem Quatro Patas? "+ animal.getIsQuadrupede());
		System.out.println("ele voa? "+ animal.getIsVoa());
		
		return new ModelAndView("redirect:/");
	}
}
