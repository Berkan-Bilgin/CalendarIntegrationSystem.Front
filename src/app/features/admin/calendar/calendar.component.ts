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
    // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
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
  ) {
    console.log(INITIAL_EVENTS);
  }

  ngOnInit() {
    this.eventService.getEvents().subscribe((events) => {
      // Eventleri FullCalendar formatına dönüştür
      const calendarEvents = events.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        allDay: event.allDay || false, // allDay değerini backend'den de alabilirsiniz
      }));

      // CalendarOptions'a eventleri ekle
      this.calendarOptions.update((options) => ({
        ...options,
        events: calendarEvents,
      }));
    });
  }

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
    //confirm yerine popup eklenicek
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`,
      )
    ) {
      this.eventService.deleteEvent(clickInfo.event.id).subscribe(
        () => {
          // Başarılı olursa, etkinliği takvimden kaldır
          clickInfo.event.remove();
        },
        (error) => {
          // Hata olursa, kullanıcıya bir mesaj göster
          console.error('Event silme hatası:', error);
          alert('Event silinemedi. Lütfen tekrar deneyin.');
        },
      );
    }
  }
  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  onConfirmModal(formValue: any) {
    const newEvent = {
      title: formValue.eventName,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
    };

    this.eventService.createEvent(newEvent).subscribe((event) => {
      console.log('event nedir', newEvent);
      const calendarApi = this.selectedDateInfo?.view.calendar;

      if (calendarApi) {
        const calendarEvent = {
          id: event.id,
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          allDay: event.allDay || false,
        };
        calendarApi.addEvent(calendarEvent);
      }

      this.selectedDateInfo = null;
    });
  }
}
