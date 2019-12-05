import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor( private messageService: MessageService) { }

  handle(errorResponse: any) {
    let msg: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    } else if (errorResponse.status >= 400 && errorResponse.status <= 499) {

      let errors;
      msg = 'Solicitação não processada - ERROR';

      try {
        errors = errorResponse.json();
        msg = errors[0].mensagemUsuario;
      } catch (e) { }
    } else {
      msg = 'Erro ao processar serviço Remoto. Tente novamente.';
    }

    this.messageService.add({severity: 'error', detail: msg});
  }
}
