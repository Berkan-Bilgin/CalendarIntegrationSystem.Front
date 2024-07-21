import {
  Component,
  signal,
  ChangeDetectorRef,
  ViewChild,
  HostListener,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventDropArg,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS } from './event.utils';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { EventService } from '../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule, ModalComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  modalTitle: string = '';
  modalContent: string = '';
  confirmButtonText: string = 'Save';
  cancelButtonText: string = 'Cancel';
  confirmButtonClass: string = 'btn-primary';
  showForm: boolean = false;
  selectedEvent: EventApi | null = null;
  selectedTask: EventApi | null = null;
  dropdownOpened: boolean = false;

  selectedEventItemType: any = '';
  selectedDateInfo: DateSelectArg | null = null;
  actionType: 'create' | 'delete' | 'update' | null = null;
  itemType: 'Event' | 'Task' = 'Event';
  eventDropdownVisible: boolean = false;
  taskDropdownVisible: boolean = false;

  @ViewChild('myModal') myModal!: ModalComponent;
  @ViewChild('eventDropdownMenu', { static: false })
  eventDropdownMenu!: ElementRef;
  @ViewChild('taskDropdownMenu', { static: false })
  taskDropdownMenu!: ElementRef;

  @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;
  private clickListener!: () => void;

  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,

    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(
    private changeDetector: ChangeDetectorRef,
    private taskService: TaskService,
    private eventService: EventService,
    private toastr: ToastrService,
    private renderer: Renderer2,
  ) {}

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.eventDropdownVisible = false;
  }

  logArg(arg: any) {
    console.log('Event arg:', arg);
  }

  handleEventDrop(eventDropInfo: EventDropArg) {
    console.log(eventDropInfo);
    console.log('Yeni tarih:', eventDropInfo.event.startStr.slice(0, -6));
    console.log('Yeni tarih:', eventDropInfo.event.endStr.slice(0, -6));
    console.log(eventDropInfo.event.id);

    const updatedItem = {
      id: eventDropInfo.event.id,
      startDate: eventDropInfo.event.startStr,
      endDate: eventDropInfo.event.endStr,
    };

    const itemType = eventDropInfo.event.extendedProps['itemType'];

    if (itemType === 'Event') {
      this.eventService.updateEvent(updatedItem).subscribe(
        () => {
          this.toastr.success('Event updated successfully');
        },
        (error) => {
          console.error('Event update error:', error);
          this.toastr.error(`Failed to update event: ${error.message}`);
          eventDropInfo.revert();
        },
      );
    } else if (itemType === 'Task') {
      this.taskService.updateTask(updatedItem).subscribe(
        () => {
          this.toastr.success('Task updated successfully');
        },
        (error) => {
          console.error('Task update error:', error);
          this.toastr.error(`Failed to update task: ${error.message}`);
          eventDropInfo.revert();
        },
      );
    } else {
      console.error('Unknown item type:', itemType);
      this.toastr.error('Failed to update item: unknown type');
      eventDropInfo.revert();
    }

    console.log(updatedItem);
  }
  toggleEventDropdown() {
    this.eventDropdownVisible = !this.eventDropdownVisible;
    this.taskDropdownVisible = false;
    console.log(this.eventDropdownVisible);
  }

  toggleTaskDropdown() {
    this.taskDropdownVisible = !this.taskDropdownVisible;
    this.eventDropdownVisible = false;
    console.log(this.taskDropdownVisible);
  }

  ngOnInit() {
    // this.loadEvents();

    this.loadCalendarItems();

    this.clickListener = this.renderer.listen('document', 'click', (e) => {
      if (
        this.eventDropdownVisible &&
        this.eventDropdownMenu &&
        !this.eventDropdownMenu.nativeElement.contains(e?.target)
      ) {
        this.eventDropdownVisible = false;
        this.changeDetector.detectChanges(); // Değişiklikleri algılaması için ChangeDetectorRef kullanın
      }
    });
  }

  loadCalendarItems() {
    this.eventService.getCalendarItems().subscribe((calendarItems) => {
      console.log(calendarItems);
      const calendarEvents = calendarItems.events.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        itemType: event.itemType,
      }));

      const calendarTasks = calendarItems.tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        start: task.startDate,
        end: task.endDate,
        itemType: task.itemType,
        eventBackgroundColor: 'red',
      }));

      const allCalendarItems = [...calendarEvents, ...calendarTasks];

      this.calendarOptions.update((options) => ({
        ...options,
        events: allCalendarItems,
      }));
    });
  }

  // loadEvents() {
  //   this.eventService.getEvents().subscribe((events) => {
  //     const calendarEvents = events.map((event: any) => ({
  //       id: event.id,
  //       title: event.title,
  //       start: event.startDate,
  //       end: event.endDate,
  //       allDay: event.allDay || false,
  //     }));

  //     this.calendarOptions.update((options) => ({
  //       ...options,
  //       events: calendarEvents,
  //     }));
  //   });
  // }

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
    selectInfo.view.calendar.unselect(); // clear date selection
    this.selectedEvent = null;
    this.selectedDateInfo = selectInfo;
    this.eventDropdownVisible = false;
    this.taskDropdownVisible = false;

    const itemType = confirm(
      'Create Event? Click OK for Event, Cancel for Task',
    )
      ? 'Event'
      : 'Task';

    // if (selectInfo.view.type === 'dayGridMonth') {
    //   console.log('Month view selected:', selectInfo);
    // } else if (
    //   selectInfo.view.type === 'timeGridWeek' ||
    //   selectInfo.view.type === 'dayGridWeek'
    // ) {
    //   console.log('Week view selected:', selectInfo);
    // } else {
    //   console.log('Other view selected:', selectInfo);
    // }
    console.log(selectInfo);
    this.configureModal('create', itemType);
    this.setDefaultDateTime(selectInfo);
    this.myModal.openModal();
  }

  handleEventClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.stopPropagation();
    this.selectedEventItemType = clickInfo.event.extendedProps['itemType'];
    if (this.selectedEventItemType === 'Event') {
      this.toggleEventDropdown();
    } else if (this.selectedEventItemType === 'Task') {
      this.toggleTaskDropdown();
    }

    // this.toggleEventDropdown();
    console.log('clickInfo nedir', clickInfo);
    console.log(this.selectedEventItemType);
    this.selectedEvent = clickInfo.event;
    // this.selectedDateInfo = null;
    // this.configureModal('delete', clickInfo.event);
    // this.myModal.openModal();
  }

  handleUpdateTaskClick(task: EventApi) {
    this.selectedTask = task;
    this.configureModal('update', 'Task', task);
    this.myModal.openModal();
  }

  handleDeleteTaskClick(task: EventApi) {
    this.selectedTask = task;
    this.configureModal('delete', 'Task', task);
    this.myModal.openModal();
  }

  handleUpdateClick(event: EventApi) {
    console.log(event);
    this.selectedEvent = event;
    this.configureModal('update', 'Event', event);
    this.myModal.openModal();
  }

  handleDeleteClick(event: EventApi) {
    console.log(event);
    this.selectedEvent = event;
    this.configureModal('delete', 'Event', event);
    this.myModal.openModal();
  }

  // configureModal(
  //   action: 'create' | 'update' | 'delete',
  //   itemType: 'Event' | 'Task',
  //   event?: EventApi,
  // ) {
  //   this.itemType = itemType;
  //   this.actionType = action;
  //   if (action === 'create') {
  //     this.setCreateModalConfig();
  //   } else if (action === 'update') {
  //     this.setUpdateModalConfig(event!);
  //   } else if (action === 'delete') {
  //     this.setDeleteModalConfig(event!);
  //   }
  // }

  configureModal(
    action: 'create' | 'update' | 'delete',
    itemType: 'Event' | 'Task',
    event?: EventApi,
  ) {
    this.itemType = itemType;
    this.actionType = action;
    switch (`${action}_${itemType}`) {
      case 'create_Event':
        this.setCreateEventModalConfig();
        break;
      case 'update_Event':
        this.setUpdateEventModalConfig(event!);
        break;
      case 'delete_Event':
        this.setDeleteEventModalConfig(event!);
        break;
      case 'create_Task':
        this.setCreateTaskModalConfig();
        break;
      case 'update_Task':
        this.setUpdateTaskModalConfig(event!);
        break;
      case 'delete_Task':
        this.setDeleteTaskModalConfig(event!);
        break;
      default:
        console.error('Invalid modal configuration');
        break;
    }
  }

  setUpdateEventModalConfig(event: EventApi) {
    this.modalTitle = 'Update Event';
    this.modalContent = 'Please update the title of your event';
    this.confirmButtonText = 'Update';
    this.confirmButtonClass = 'btn-primary';
    this.showForm = true;
    console.log('update event nedir', event.id);
    console.log('update event nedir', event.startStr.slice(0, -6));

    this.myModal.form.patchValue({
      eventName: event.title,
      //burası yanlış olabilir zaman farkına dikkat et
      startDate: event.startStr.slice(0, -6),
      endDate: event.endStr.slice(0, -6),
    });
  }

  setCreateEventModalConfig() {
    this.modalTitle = 'Create Event';
    this.modalContent = 'Please enter a new title for your event';
    this.confirmButtonText = 'Save';
    this.confirmButtonClass = 'btn-primary';
    this.showForm = true;
  }

  setDeleteEventModalConfig(event: EventApi) {
    this.modalTitle = 'Delete Event';
    this.modalContent = `Are you sure you want to delete the event '${event.title}'?`;
    this.confirmButtonText = 'Delete';
    this.confirmButtonClass = 'btn-secondary';
    this.showForm = false;
  }

  setUpdateTaskModalConfig(task: EventApi) {
    this.modalTitle = 'Update Task';
    this.modalContent = 'Please update the title of your task';
    this.confirmButtonText = 'Update';
    this.confirmButtonClass = 'btn-primary';
    this.showForm = true;
    console.log('update event nedir', task.id);
    console.log('update event nedir', task.startStr.slice(0, -6));

    this.myModal.form.patchValue({
      eventName: task.title,
      //burası yanlış olabilir zaman farkına dikkat et
      startDate: task.startStr.slice(0, -6),
      endDate: task.endStr.slice(0, -6),
    });
  }

  setCreateTaskModalConfig() {
    this.modalTitle = 'Create Task';
    this.modalContent = 'Please enter a new title for your task';
    this.confirmButtonText = 'Save';
    this.confirmButtonClass = 'btn-primary';
    this.showForm = true;
  }

  setDeleteTaskModalConfig(task: EventApi) {
    this.modalTitle = 'Delete Task';
    this.modalContent = `Are you sure you want to delete the event '${task.title}'?`;
    this.confirmButtonText = 'Delete';
    this.confirmButtonClass = 'btn-secondary';
    this.showForm = false;
  }

  setDefaultDateTime(selectInfo: DateSelectArg) {
    const defaultStartTime = 'T09:00:00';
    const defaultEndTime = 'T10:00:00';

    console.log(selectInfo.startStr + defaultStartTime);

    let [year, month, day] = selectInfo.endStr.split('-').map(Number);
    day -= 1;
    let formattedEndDate =
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` +
      defaultEndTime;

    this.myModal.form.patchValue({
      startDate: selectInfo.startStr + defaultStartTime,
      endDate: formattedEndDate,
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  onConfirmModal() {
    switch (`${this.actionType}_${this.itemType}`) {
      case 'create_Event':
        this.createEvent();
        break;
      case 'update_Event':
        this.updateEvent();
        break;
      case 'delete_Event':
        this.deleteEvent();
        break;
      case 'create_Task':
        this.createTask();
        break;
      case 'update_Task':
        this.updateTask();
        break;
      case 'delete_Task':
        this.deleteTask();
        break;
      default:
        console.error('Invalid action');
        break;
    }
  }
  updateEvent() {
    console.log(this.selectedEvent?.id);
    const formValue = this.myModal.form.value;
    const updatedEvent = {
      id: this.selectedEvent!.id,
      title: formValue.eventName,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
    };

    this.eventService.updateEvent(updatedEvent).subscribe(
      (event) => {
        let calendarApi = this.fullCalendar.getApi();
        console.log(calendarApi);
        if (calendarApi) {
          console.log('buraya giriyo mu ', calendarApi);
          const calendarEvent = calendarApi.getEventById(updatedEvent.id);
          if (calendarEvent) {
            console.log('giriyor mu calendarEvent', calendarEvent);
            calendarEvent.setProp('title', updatedEvent.title);
            calendarEvent.setStart(updatedEvent.startDate);
            calendarEvent.setEnd(updatedEvent.endDate);
          }
        }
        this.toastr.success('Event successfully updated');
      },
      (error) => {
        console.error('Event update error:', error);
        this.toastr.error('Failed to update event');
      },
    );
  }

  createEvent() {
    const formValue = this.myModal.form.value;
    const newEvent = {
      title: formValue.eventName,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
    };

    this.eventService.createEvent(newEvent).subscribe((event) => {
      const calendarApi = this.selectedDateInfo?.view.calendar;
      if (calendarApi) {
        calendarApi.addEvent({
          id: event.id,
          title: event.title,
          start: event.startDate,
          itemType: 'Event',
          end: event.endDate,
          allDay: event.allDay || false,
        });
        this.toastr.success('Event successfully added');
      }
      this.selectedDateInfo = null;
    });
  }

  deleteEvent() {
    this.eventService.deleteEvent(this.selectedEvent!.id).subscribe(
      () => {
        this.selectedEvent!.remove();
        this.toastr.success('Event successfully deleted');
      },
      (error) => {
        console.error('Event delete error:', error);
      },
    );
  }

  createTask() {
    const formValue = this.myModal.form.value;
    const newTask = {
      title: formValue.eventName,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
    };

    this.taskService.createTask(newTask).subscribe((task) => {
      const calendarApi = this.selectedDateInfo?.view.calendar;
      if (calendarApi) {
        calendarApi.addEvent({
          id: task.id,
          title: task.title,
          start: task.startDate,
          itemType: 'Task',
          end: task.endDate,
          allDay: task.allDay || false,
        });
        this.toastr.success('Task successfully added');
      }
      this.selectedDateInfo = null;
    });
  }

  updateTask() {
    console.log(this.selectedTask?.id);
    const formValue = this.myModal.form.value;
    const updatedTask = {
      id: this.selectedTask!.id,
      title: formValue.eventName,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
    };

    this.taskService.updateTask(updatedTask).subscribe(
      (task) => {
        let calendarApi = this.fullCalendar.getApi();
        console.log(calendarApi);
        if (calendarApi) {
          console.log('buraya giriyo mu ', calendarApi);
          const calendarEvent = calendarApi.getEventById(updatedTask.id);
          if (calendarEvent) {
            console.log('giriyor mu calendarEvent', calendarEvent);
            calendarEvent.setProp('title', updatedTask.title);
            calendarEvent.setStart(updatedTask.startDate);
            calendarEvent.setEnd(updatedTask.endDate);
          }
        }
        this.toastr.success('Task successfully updated');
      },
      (error) => {
        console.error('Task update error:', error);
        this.toastr.error('Failed to update task');
      },
    );
  }

  deleteTask() {
    this.taskService.deleteTask(this.selectedTask!.id).subscribe(
      () => {
        this.selectedTask!.remove();
        this.toastr.success('Task successfully deleted');
      },
      (error) => {
        console.error('Event delete error:', error);
      },
    );
  }
}
