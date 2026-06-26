import { TicketStatus } from '../../ticket/enums/ticket-status.enum';
import {
  InvalidTicketStatus,
  ParkingCalculationResult,
  SettingsView,
  TicketView,
} from './pre-checkout';

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_FRACTION = 15;
const FRACTIONS_PER_HOUR = 4;

function timeDifferenceInMinutes(endDate: Date, startDate: Date): number {
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60));
}

export function timeAfterPayment(ticket: TicketView): number {
  return timeDifferenceInMinutes(new Date(), new Date(ticket.updatedAt));
}

function parkingDuration(ticket: TicketView): number {
  if (ticket.status === TicketStatus.OPEN) {
    return timeDifferenceInMinutes(new Date(), new Date(ticket.checkInTime));
  }
  if (ticket.status === TicketStatus.PAID) {
    return timeAfterPayment(ticket);
  }
  throw new InvalidTicketStatus();
}

function fractionValue(minutes: number, fractionRate: number, hourlyRate: number): number {
  if (minutes <= 0) return 0;
  const roundedMinutes = Math.ceil(minutes / MINUTES_PER_FRACTION) * MINUTES_PER_FRACTION;
  const fractionCount = roundedMinutes / MINUTES_PER_FRACTION;
  return fractionCount === FRACTIONS_PER_HOUR ? hourlyRate : fractionCount * fractionRate;
}

export function calculateParkingFee(ticket: TicketView, settings: SettingsView): ParkingCalculationResult {
  const duration = parkingDuration(ticket);
  const fullHours = Math.floor(duration / MINUTES_PER_HOUR);
  const remainingMinutes = duration % MINUTES_PER_HOUR;
  const fullHoursValue = fullHours * settings.valueHour;
  const fraction = fractionValue(remainingMinutes, settings.valueFractionHour, settings.valueHour);
  return {
    duration: `${fullHours} horas e ${remainingMinutes} minutos`,
    amountDue: (fullHoursValue + fraction).toFixed(2),
  };
}
