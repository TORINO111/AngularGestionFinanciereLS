import { UtilisateurService } from './../../../services/utilisateurs/utilisateur.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { TresorerieService } from 'src/app/services/tresorerie/tresorerie.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SocieteService } from 'src/app/services/societe/societe.service';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss'],
  standalone: false
})
export class UtilisateursComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('editcontent', { static: true }) editcontent: any;

  closeResult: string = '';
  pageTitle: BreadcrumbItem[] = [];
  subtitle: string;
  utilisateurForm: UntypedFormGroup;
  saveSuccess = false;
  saveFail = false;
  loading = false;
  isOpen = false;
  users: any[] = [];
  roles: any[] = [];
  superviseurs: any[] = [];
  formsArr: UntypedFormGroup[] = [];
  admin = false;
  societes: any[] = [];
  idAdmin: number;
  user: any;

  result = false;
  isLoading = false;
  searchLibelle = '';
  private search$ = new Subject<{ libelle: string }>();

  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private societeService: SocieteService,
    private modalService: NgbModal,
    private tresorerieService: TresorerieService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private notification: NotificationService,
    private utilisateurService: UtilisateurService,
  ) {
    const userJson = localStorage.getItem("user");
    this.user = userJson ? JSON.parse(userJson) : null;

    this.utilisateurForm = this.fb.group({
      id: [],
      username: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', Validators.required],
      email: [''],
      password: [''],
      confirmation: [''],
      enabled: [],
      idRole: [],
      cabinetId: [this.user?.cabinet?.id],
      superviseurId: []
    });

    this.chargerRoles();
    this.chargerSuperviseurs();
    this.loadUsers();
    console.log(this.user?.cabinet);
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'utilisateurs', path: '/', active: true }];
    this.loadSocietes();
  }

  private loadSocietes(): void {
    this.societeService.getAllSociete().subscribe({
      next: (data: any[]) => {
        this.societes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des sociétés', err);
      }
    });
  }

  chargerRoles() {
    this.tresorerieService.allRoles().subscribe(
      (data: any) => { // <== utiliser 'any' ici
        let roles: any[] = data as any[];

        if (this.user?.cabinet !== null && this.user?.cabinet !== undefined) {
          roles = roles.filter(role => role.libelle !== 'ADMIN');
        }

        this.roles = roles;
        this.result = true;
      },
      error => {
        this.result = true;
        this.notification.showError("Erreur lors du chargement des rôles.");
      }
    );
  }

  chargerSuperviseurs() {
    this.tresorerieService.allSuperviseurs().subscribe({
      next: (data) => {
        this.superviseurs = data;
        this.result = true;
      },
      error: (err) => {
        this.result = true;
        this.notification.showError("Erreur lors du chargement des superviseurs.");
      }
    });
  }

  onSaveUtilisateur(utilisateurFormValue: any) {
    // console.log(utilisateurFormValue.value);
    // return;
    if (utilisateurFormValue.valid) {
      this.tresorerieService.addUser(utilisateurFormValue.value).subscribe(
        {
          next: (response: any) => {
            this.notification.showSuccess('Enregistré  avec succès');
            this.loading = false;
            //console.log(response);
            this.users = [];
            this.loadUsers();
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.notification.showError('Erreur serveur');
          }
        }
      );
    } else {
      this.notification.showWarning('formulaire invalide');
    }

  }

  // loadUsers() {
  //   this.formsArr = [];
  //   // this.tresorerieService.allUtilisateurs().subscribe({
  //   this.utilisateurService.getAllPageable().subscribe({
  //     next: (usersData) => {
  //       const role = sessionStorage.getItem('role');
  //       this.admin = role === 'a';
  //       this.users = usersData;

  //       for (let user of usersData) {
  //         let selected = [];
  //         let isAdmin = false;

  //         for (let role of user.roles) {
  //           selected.push({ id: role.id, itemName: role.libelle });
  //           if (role.libelle === 'ADMIN') {
  //             this.idAdmin = user.id;
  //             isAdmin = true;
  //           }
  //         }

  //         this.formsArr.push(this.fb.group({
  //           id: [user.id],
  //           username: [user.username, [Validators.required, Validators.minLength(2)]],
  //           email: [user.email],
  //           nom: [user.nom, Validators.required],
  //           prenom: [user.prenom, Validators.required],
  //           enabled: [user.enabled],
  //           idRole: [user.idRole],
  //           adm: [isAdmin],
  //           modelRoles: [selected],
  //           cabinetId: [user?.cabinet?.id],
  //           superviseurId: []
  //         }));
  //       }

  //       this.result = true;
  //     },
  //     error: (err) => {
  //       this.result = true;
  //       this.notification.showError("Erreur lors du chargement des utilisateurs.");
  //     }
  //   });
  // }

  loadUsers(page: number = 0): void {
    this.result = false;
    this.isLoading = true;
    this.currentPage = page;

    this.utilisateurService.getAllPageable(
      page,
      this.pageSize,
      this.searchLibelle || undefined
    ).subscribe({
      next: (data) => {
        this.users = data.content;
        this.totalElements = data.totalElements;
        this.result = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.result = true;
        this.isLoading = false;
        this.notification.showError("Erreur lors du chargement des utilisateurs.");
      }
    });
  }

  onFilterChange(): void {
    this.search$.next({ libelle: this.searchLibelle });
  }

  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(({ libelle }) => {
          this.currentPage = 0;
          return this.utilisateurService.getAllPageable(0, this.pageSize, libelle || undefined);
        })
      )
      .subscribe({
        next: (data) => {
          this.users = data.content;
          this.totalElements = data.totalElements;
          this.currentPage = 0;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors de la recherche', err);
          this.isLoading = false;
        }
      });
  }

  pages(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  goToPage(page: number = 0) {
    this.loadUsers(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  showConfirmationSwal(title: string, text: string, confirmText: string, onConfirm: () => void) {
    Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText,
      cancelButtonText: 'Non'
    }).then((result: any) => {
      if (result.value) {
        onConfirm();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Abandonné', `${title.toLowerCase()} annulée`, 'error');
      }
    });
  }

  onAdd(data: any) {
    this.isOpen = false;
    this.tresorerieService.addData(data).subscribe(() => {
      this.loading = false;
    });
  }

  onAddUser(data: any) {
    this.isOpen = false;
    this.tresorerieService.addUser(data).subscribe(() => {
      this.loading = false;
      this.loadUsers();
    });
  }

  onUpdateUser(user: any) {
    this.tresorerieService.updateUtilisateur(user.id, user).subscribe(() => {
      this.saveSuccess = true;
      this.loading = false;
      this.notification.showSuccess('Modification effectuée avec succès');
      setTimeout(() => (this.saveSuccess = false), 3000);
      this.loadUsers();
    }, error => {
      this.saveFail = true;
      this.loading = false;
      this.notification.showError('Échec de la modification');
      setTimeout(() => (this.saveFail = false), 3000);
    });
  }

  deleteUser(id: number) {
    this.showConfirmationSwal(
      'Etes-vous sûr ?',
      'Cette action est irréversible !',
      'Oui, Supprimer !',
      () => {
        this.tresorerieService.deleteUser(id).subscribe(res => {
          if (res != null) {
            this.loadUsers();
            Swal.fire('Supprimé!', 'Utilisateur supprimé.', 'success');
          } else {
            Swal.fire('Erreur', 'Utilisateur non supprimé.', 'error');
          }
        }, () => Swal.fire('Erreur', 'Utilisateur non supprimé.', 'error'));
      }
    );
  }

  addAdmin(id: number) {
    this.showConfirmationSwal(
      'Etes-vous sûr ?',
      'Cette action est irréversible !',
      'Oui, activer !',
      () => {
        this.tresorerieService.addAdmin(id).subscribe(res => {
          if (res != null) {
            this.loadUsers();
            Swal.fire('Activé!', 'Administrateur activé.', 'success');
          } else {
            Swal.fire('Erreur', 'Administrateur non activé.', 'error');
          }
        }, () => Swal.fire('Erreur', 'Administrateur non activé.', 'error'));
      }
    );
  }

  suppAdmin(id: number) {
    this.showConfirmationSwal(
      'Etes-vous sûr ?',
      'Cette action est irréversible !',
      'Oui, désactiver !',
      () => {
        this.tresorerieService.removeAdmin(id).subscribe(res => {
          if (res != null) {
            this.loadUsers();
            Swal.fire('Désactivé!', 'Administrateur désactivé.', 'success');
          } else {
            Swal.fire('Erreur', 'Administrateur non désactivé.', 'error');
          }
        }, () => Swal.fire('Erreur', 'Administrateur non désactivé.', 'error'));
      }
    );
  }

  activateUser(id: number, value: any) {
    this.tresorerieService.activateUser(id, value).subscribe(() => this.loadUsers());
  }

  desactivateUser(id: number, value: any) {
    this.tresorerieService.desactivateUser(id, value).subscribe(() => this.loadUsers());
  }

  openScrollableModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content,
      {
        size: 'lg', // set modal size
        centered: true, scrollable: true,
        backdrop: 'static', // disable modal from closing on click outside
        keyboard: false,
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  openModal(): void {
    this.modalService.open(this.content, { size: 'lg', centered: true });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return 'with: ${reason}';
    }
  }

}