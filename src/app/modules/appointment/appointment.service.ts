import { IJwtPayload } from "../../types";
// import { v4 as uuidv4 } from "uuid";

const createAppointment = async (
  user: IJwtPayload,
  payload: { doctorId: string; scheduleId: string }
) => {};

export const AppointmentService = {
  createAppointment,
};
