import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('Should be able to create a new appointment', async () => {
    const aRandomId = '75878902347';

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: aRandomId,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(aRandomId);
  });

  it('Should not be able to create two appointments at the same time', async () => {
    const aRandomId = '75878902347';
    const appointmentDate = new Date(2020, 11, 13, 12);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: aRandomId,
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: aRandomId,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
