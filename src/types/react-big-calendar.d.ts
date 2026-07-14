declare module "react-big-calendar" {
  import { ComponentType, SyntheticEvent } from "react";

  export interface Event {
    allDay?: boolean;
    title?: React.ReactNode;
    start?: Date;
    end?: Date;
    resource?: any;
  }

  export interface CalendarProps {
    localizer: any;
    events?: any[];
    startAccessor?: string | ((event: any) => Date);
    endAccessor?: string | ((event: any) => Date);
    style?: React.CSSProperties;
    onSelectEvent?: (event: any, e: SyntheticEvent<HTMLElement>) => void;
    eventPropGetter?: (
      event: any,
      start: Date,
      end: Date,
      isSelected: boolean
    ) => { className?: string; style?: React.CSSProperties };
    views?: any;
    defaultView?: string;
    culture?: string;
    messages?: any;
  }

  export const Calendar: ComponentType<CalendarProps>;
  export function dateFnsLocalizer(config: any): any;
}
