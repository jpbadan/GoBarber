import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    // Funçoes assincronas sempre retornam uma promise!!!

    const findAppointment = await this.findOne({
      where: { date },
    });

    return findAppointment || null; // if findAppointment is undefined -> return null
  }
}

export default AppointmentsRepository;
