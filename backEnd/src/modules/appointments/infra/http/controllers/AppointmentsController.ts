import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;

    // Transforma data num formato JS
    const parsedDate = parseISO(date);

    // Sem injeção de dependencias:
    // const appointmentsRepository = new AppointmentsRepository();
    // const createAppointment = new CreateAppointmentService(
    //   appointmentsRepository,
    // );

    // Com injeção de dependencias:
    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      provider_id,
      date: parsedDate,
    });

    return response.json(appointment);
  }
}
