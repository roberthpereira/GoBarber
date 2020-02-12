import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    // cada job precisa de uma chava unica
    return 'CancellationMail';
  }

  // tarefa q ira executar qnd esse processo for executado
  async handle({ data }) {
    const { appointment } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${appointment.provier.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
