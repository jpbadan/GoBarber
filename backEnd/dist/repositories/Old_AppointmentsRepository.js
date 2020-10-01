"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var date_fns_1 = require("date-fns");
var Appointment_1 = __importDefault(require("../models/Appointment"));
var AppointmentsRepository = /** @class */ (function () {
    function AppointmentsRepository() {
        this.appointments = [];
    }
    AppointmentsRepository.prototype.all = function () {
        return this.appointments;
    };
    AppointmentsRepository.prototype.findByDate = function (date) {
        var findAppointment = this.appointments.find(function (appointment) {
            return date_fns_1.isEqual(date, appointment.date);
        });
        return findAppointment || null; // if findAppointment is undefined -> return null
    };
    AppointmentsRepository.prototype.create = function (_a) {
        var date = _a.date, provider = _a.provider;
        var appointment = new Appointment_1.default({ provider: provider, date: date });
        this.appointments.push(appointment);
        return appointment;
    };
    return AppointmentsRepository;
}());
exports.default = AppointmentsRepository;
