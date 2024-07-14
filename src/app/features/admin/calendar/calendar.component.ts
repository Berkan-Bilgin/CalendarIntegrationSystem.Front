import { Component, signal, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event.utils';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule, ModalComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  modalTitle: string = '';
  modalContent: string = '';
  confirmButtonText: string = 'Save';
  cancelButtonText: string = 'Cancel';
  showForm: boolean = false;
  selectedEvent: EventApi | null = null;
  selectedDateInfo: DateSelectArg | null = null;

  @ViewChild('myModal') myModal!: ModalComponent;
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(
    private changeDetector: ChangeDetectorRef,
    private eventService: EventService,
  ) {}

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    // const title = prompt('Please enter a new title for your event');

    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection
    console.log('selectInfo nedir', selectInfo);

    this.modalTitle = 'Create Event';
    this.modalContent = 'Please enter a new title for your event';
    this.confirmButtonText = 'Save';
    this.cancelButtonText = 'Cancel';
    this.showForm = true;
    this.selectedEvent = null;
    this.selectedDateInfo = selectInfo;

    const defaultStartTime = 'T09:00:00';
    const defaultEndTime = 'T10:00:00'; // Varsayılan olarak 1 saat sonrası

    this.myModal.form.patchValue({
      startDate: selectInfo.startStr + defaultStartTime,
      //Burası iyi bir çözüm değil toplu seçimleri düşün.
      endDate: selectInfo.startStr + defaultEndTime,
    });

    this.myModal.openModal();

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay,
    //   });
    // }
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log('clickInfo', clickInfo.event);
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`,
      )
    ) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  onConfirmModal(formValue: any) {
    const newEvent = {
      title: formValue.eventName,
      start: formValue.startDate,
      end: formValue.endDate,
      allDay: false,
    };

    this.eventService.createEvent(newEvent).subscribe((event) => {
      const calendarApi = this.selectedDateInfo?.view.calendar;

      if (calendarApi) {
        calendarApi.addEvent(event);
      }

      this.selectedDateInfo = null;
    });
  }
}
