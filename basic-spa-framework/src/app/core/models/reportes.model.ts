import { BaseDto } from "./base-dto";

export interface ReporteDto extends BaseDto {
  filter: string;
  guadua: boolean;
  selectedReportType: number;
  desde:Date;
  hasta:Date;
}
