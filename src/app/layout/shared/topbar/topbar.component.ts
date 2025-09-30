import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LayoutEventType } from 'src/app/core/constants/events';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { EventService } from 'src/app/core/service/event.service';
import { LEFT_SIDEBAR_TYPE_CONDENSED, LEFT_SIDEBAR_TYPE_DEFAULT } from '../config/layout.model';
import { BrandItem } from '../models/brands.model';
import { CreateNewMenuOption } from '../models/create-new.model';
import { Language } from '../models/language.model';
import { NotificationItem } from '../models/notification.model';
import { ProfileOptionItem } from '../models/profileoption.model';
import { SearchResultItem, SearchUserItem } from '../models/search.model';
import { Societe } from 'src/app/models/societe.model';
import { SocieteService } from 'src/app/services/societe/societe.service';
import { SocieteSelectionService } from 'src/app/services/societe-selection/societe-selection.service';
import { ExerciceComptableService } from '../../../services/exercices-comptables/exercice-comptable.service';
import { ExerciceComptable } from '../../../models/exercice-comptable.model';
import { Router } from '@angular/router';
import { ExerciceSelectionService } from 'src/app/services/exercices-selection/exercice-selection.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
    standalone: false
})
export class TopbarComponent implements OnInit {

  @Input() layoutType: string = '';
  @Input() leftSidebarTheme: string = 'light';
  createMenuOptions: CreateNewMenuOption[] = [];
  notificationList: NotificationItem[] = [];
  languages: Language[] = [];
  brands: BrandItem[] = [];
  profileOptions: ProfileOptionItem[] = [];
  selectedLanguage?: Language;
  searchResults: SearchResultItem[] = [];
  searchUsers: SearchUserItem[] = [];


  loggedInUser: any = {};
  topnavCollapsed: boolean = false;

  // output events
  @Output() mobileMenuButtonClicked = new EventEmitter<void>();
  @Output() settingsButtonClicked = new EventEmitter<boolean>();

  societe: Societe[] = [];
  filteredSocietes: Societe[] = [];
  searchText: string = '';
  selectedSociete: Societe;
  exerciceEnCours?: ExerciceComptable;
  societeId?: number;

  constructor (
    private exerciceService: ExerciceComptableService,
    private authService: AuthenticationService,
    private eventService: EventService,
    private societeService: SocieteService,
    private societeSelectionService: SocieteSelectionService,
    private _route:Router,
    private exerciceSelectionService: ExerciceSelectionService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.currentUser();

    this.loadSocietes();
    this.selectedSociete = JSON.parse(localStorage.getItem('societeActive') || 'null');
    this.loadExercice();
    this._fetchMenus();
    this._fetchSearchData();
    this._fetchNotifications();
    this._fetchBrands();
    this._fetchLanguages();
    this._fetchProfileOptions();

    //console.log(this.loggedInUser)

    document.addEventListener('fullscreenchange', this.exitHandler);
    document.addEventListener("webkitfullscreenchange", this.exitHandler);
    document.addEventListener("mozfullscreenchange", this.exitHandler);
  }

  loadSocietes() {
    this.societeService.getSocietePourUserConnecte(this.loggedInUser!.id).subscribe(data => {
      this.societe = data;
      console.log(this.societe);
      this.filteredSocietes = data;
    });
  }

  // loadSocietes() {
  //   this.societeService.getSocietesPourComptableConnecte().subscribe(data => {
  //     this.societes = data;
  //     this.filteredSocietes = data;
  //   });
  // }

  filterSocietes() {
    const term = this.searchText.toLowerCase();
    this.filteredSocietes = this.societe.filter(s =>
      s.nom.toLowerCase().includes(term)
    );
  }

  selectSociete(societe: Societe) {
    this.selectedSociete = societe;
    localStorage.setItem('societeActive', JSON.stringify(societe));
    this.societeSelectionService.setSociete(societe); // 🔁 notifier tous les composants
    this.loadExercice();
  }

  loadExercice(): void {
    this.societeSelectionService.selectedSociete$.subscribe(societe => {
      //this.societeActive = societe;
      if (societe!== undefined) {
        this.societeId=societe!.id;
        
        this.exerciceService.getExerciceEnCoursBySociete(this.societeId!).subscribe({
          next: (data) => {
            //console.log(data)
              this.exerciceEnCours = data
          },
          error: () => this.exerciceEnCours = undefined
        });
      }
      
    });
    
  }

  loadExercice1(): void {
    this.societeSelectionService.selectedSociete$.subscribe(societe => {
      if (societe) {
        const societeId = societe.id;
        this.exerciceService.getExerciceEnCoursBySociete(societeId!).subscribe({
          next: (data) => {
            console.log(data)
              this.exerciceEnCours = data
            this.exerciceSelectionService.setSelectedExercice(data);
          },
          error: () => {
            this.exerciceEnCours = undefined;
            this.exerciceSelectionService.setSelectedExercice(null);
          }
        });
      }
    });
  }

  ouvrirNouvelExercice(): void {
    this._route.navigate(['/parametrages/exercice-comptable']);
    // const annee = new Date().getFullYear(); // ou formulaire pour choisir
    // if (window.confirm(`Voulez-vous ouvrir l'exercice ${annee} ?`)) {
    //   this.exerciceService.creerExercice({ annee, cloture: false, societeId: this.societeId }).subscribe({
    //     next: () => this.loadExercice(),
    //     error: (err) => alert('Erreur lors de l’ouverture de l’exercice : ' + err.message)
    //   });
    // }
  }

  /**
 * On view init - feather icons
 */
  ngAfterViewInit() {
  }

  /**
   * fetches menu options
   */
  _fetchMenus(): void {
    this.createMenuOptions = [{
      id: 1,
      label: 'New Projects',
      icon: 'uil uil-bag',
    },
    {
      id: 2,
      label: 'Create Users',
      icon: 'uil uil-user-plus',
    },
    {
      id: 3,
      label: 'Revenue Report',
      icon: 'uil uil-chart-pie',
    },
    {
      id: 4,
      label: 'Settings',
      icon: 'uil uil-cog',
    },
    {
      id: 4,
      label: 'Help & Support',
      icon: 'uil uil-question-circle',
    }];
  }

  /**
   * Fetches notifications
   */
  _fetchNotifications(): void {
    this.notificationList = [{
      text: 'Caleb Flakelar commented on Admin',
      isActive: true,
      subText: '1 min ago',
      icon: 'uil uil-comment-message',
      bgColor: 'primary',
      redirectTo: '/'
    },
    {
      text: 'New user registered.',
      subText: '5 min ago',
      icon: 'uil uil-user-plus',
      bgColor: 'info',
      redirectTo: '/'
    },
    {
      text: 'Cristina Pride',
      subText: 'Hi, How are you? What about our next meeting',
      avatar: 'assets/images/users/avatar-2.jpg',
      bgColor: 'success',
      redirectTo: '/'
    },
    {
      text: 'Caleb Flakelar commented on Admin',
      subText: '2 days ago',
      icon: 'uil uil-comment-message',
      bgColor: 'danger',
      redirectTo: '/'
    },
    {
      text: 'Caleb Flakelar commented on Admin',
      subText: '1 min ago',
      icon: 'uil uil-heart',
      bgColor: 'primary',
      redirectTo: '/'
    },
    {
      text: 'New user registered.',
      subText: '5 min ago',
      icon: 'uil uil-comment-message',
      bgColor: 'info',
      redirectTo: '/'
    },
    {
      text: 'Cristina Pride',
      subText: 'Hi, How are you? What about our next meeting',
      avatar: 'assets/images/users/avatar-3.jpg',
      bgColor: 'success',
      redirectTo: '/'
    },
    {
      text: 'Caleb Flakelar commented on Admin',
      subText: '2 days ago',
      icon: 'uil uil-heart',
      bgColor: 'danger',
      redirectTo: '/'
    }];
  }

  /**
   * Fetches supported languages
   */
  _fetchLanguages(): void {
    this.languages = [{
      id: 1,
      name: 'English',
      flag: 'assets/images/flags/us.jpg',
    },
    {
      id: 2,
      name: 'German',
      flag: 'assets/images/flags/germany.jpg',
    },
    {
      id: 3,
      name: 'Italian',
      flag: 'assets/images/flags/italy.jpg',
    },
    {
      id: 4,
      name: 'Spanish',
      flag: 'assets/images/flags/spain.jpg',
    },
    {
      id: 5,
      name: 'Russian',
      flag: 'assets/images/flags/russia.jpg',
    }];
    this.selectedLanguage = this.languages[0];
  }

  /**
   * Fetches brands
   */
  _fetchBrands(): void {
    this.brands = [{
      id: 1,
      name: 'Slack',
      logo: 'assets/images/brands/slack.png',
    },
    {
      id: 2,
      name: 'Github',
      logo: 'assets/images/brands/github.png',
    },
    {
      id: 3,
      name: 'Dribbble',
      logo: 'assets/images/brands/dribbble.png',
    },
    ];
  }

  /**
   * Fetches profile options
   */
  _fetchProfileOptions(): void {
    this.profileOptions = [
      
      {
        label: 'Mon Compte',
        icon: 'user',
        redirectTo: '/parametrages/mon-compte',
      },
      {
        label: 'Logout',
        icon: 'log-out',
        redirectTo: '/auth/login',
      }
    ];

  }

  /**
   * Fetches search results
   */
  _fetchSearchData(): void {
    this.searchResults = [{
      id: 1,
      text: 'Analytics Report',
      icon: 'uil uil-home-alt',
    },
    {
      id: 2,
      text: 'How can I help you?',
      icon: 'uil uil-life-ring',
    },
    {
      id: 3,
      text: 'User profile settings',
      icon: 'uil uil-sliders-v-alt',
    }];

    this.searchUsers = [{
      id: 1,
      name: 'Erwin Brown',
      position: 'UI Designer',
      profile: 'assets/images/users/avatar-2.jpg'
    },
    {
      id: 2,
      name: 'Jacob Deo',
      position: 'Developer',
      profile: 'assets/images/users/avatar-5.jpg'
    }]

  }

  /**
   * changes left sidebar width 
   */
  changeSidebarWidth(): void {
    if (document.body.hasAttribute('data-sidebar-size') && document.body.getAttribute('data-sidebar-size') === "condensed") {
      this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, LEFT_SIDEBAR_TYPE_DEFAULT);
    }
    else {
      this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, LEFT_SIDEBAR_TYPE_CONDENSED);
    }


  }

  /**
   * exit handler for full screen mode
   */
  exitHandler(): void {
    let document: any = window.document;

    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
      document.body.classList.remove('fullscreen-enable');
    }
  }

  /**
   * toggles full screen mode
   */
  toggleFullScreen(): void {
    let document: any = window.document;

    document.body.classList.toggle('fullscreen-enable');

    let elem = document.querySelector('.maximize-icon');

    if (elem.hasAttribute('data-toggle') && document.body.getAttribute('data-toggle') === "fullscreen") {
      document.body.removeAttribute('data-toggle');
    }
    else {
      elem.setAttribute('data-toggle', 'fullscreen')
    }

    if (!document.fullscreenElement && /* alternative standard method */ !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  /**
  * Toggles the right sidebar
  */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
  * Toggle the menu bar when having mobile screen
  */
  toggleMobileMenu(event: any) {
    this.topnavCollapsed = !this.topnavCollapsed;
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

}
