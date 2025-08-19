import { Component, OnInit,ViewChild,TemplateRef  } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import {FormGroup,Validators,FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { TresorerieService } from 'src/app/services/tresorerie.service';
import { forkJoin } from 'rxjs';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {
  @ViewChild('content', { static: true }) content: any;
  @ViewChild('editcontent', { static: true }) editcontent: any;
  closeResult:string='';
  pageTitle: BreadcrumbItem[] = [];
  subtitle: string;
  utilisateurForm: FormGroup;
  saveSuccess = false;
  saveFail = false;
  loading = false;
  isOpen = false;
  users: any[] = [];
  roles: any[] = [];
  superviseurs: any[] = [];
  formsArr: FormGroup[] = [];
  admin = false;
  idAdmin: number;
  configPagination = { currentPage: 1, itemsPerPage: 10 };
  result = false;
  user:any;
  constructor(
    private modalService: NgbModal,
    private tresorerieService: TresorerieService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.user=JSON.parse(localStorage.getItem("user"));
    
    this.utilisateurForm = this.fb.group({
      id:[],
      username:['',[Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', Validators.required],
      email: [''],
      password: [''],
      confirmation: [''],
      enabled:[],
      idRole:[],
      cabinetId:[this.user?.cabinet?.id],
      superviseurId:[]
    });

    this.chargerRoles();
    this.chargerSuperviseurs();
    this.loadUsers();
    console.log(this.user?.cabinet);
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'utilisateurs', path: '/', active: true }];
    
  }

  chargerRoles() {
    this.tresorerieService.allRoles().subscribe(
      (data: any[]) => {
       // console.log(data);
        
        if (this.user?.cabinet !== null || this.user?.cabinet !== undefined) {
          // Par exemple : supprimer le rôle "ADMIN"
          data = data.filter(role => role.libelle !== 'ADMIN');
        }
  
        this.roles = data;
        this.result = true;
      },
      error => {
        this.result = true;
        this.showError("Erreur lors du chargement des rôles.");
        // if (environment.enableConsoleLogs) console.error(error);
      }
    );
  }

  chargerSuperviseurs() {
    this.tresorerieService.allSuperviseurs().subscribe(
      (data: any[]) => {
        //console.log(data);
  
        this.superviseurs = data;
        this.result = true;
      },
      error => {
        this.result = true;
        this.showError("Erreur lors du chargement des superviseurs.");
        // if (environment.enableConsoleLogs) console.error(error);
      }
    );
  }
  

  onSaveUtilisateur(utilisateurFormValue){
    // console.log(utilisateurFormValue.value);
    // return;
    if(utilisateurFormValue.valid){
      this.tresorerieService.addUser(utilisateurFormValue.value).subscribe(
        {
          next: (response:any) => {
            this.utilisateurForm.reset();
            this.showSuccess('Enregistré  avec succès');
            this.loading=false;
            //console.log(response);
            this.users=[];
            this.loadUsers();
           },
          error: (error) => {
            console.log(error);
            this.loading=false;
            this.showError('Erreur serveur');  
          }
        }
        );
    }else{
      this.showWarning('formulaire invalide');
    }
    
  }

  loadUsers() {
    this.formsArr = [];
    this.tresorerieService.allUtilisateurs().subscribe((usersData: any[]) => {
      const role = sessionStorage.getItem('role');
      this.admin = role === 'a';
      //console.log(usersData)
      this.users = usersData;
      for (let user of usersData) {
        let selected = [];
        let isAdmin = false;

        for (let role of user.roles) {
          selected.push({ id: role.id, itemName: role.libelle });
          if (role.libelle === 'ADMIN') {
            this.idAdmin = user.id;
            isAdmin = true;
          }
        }

        this.formsArr.push(this.fb.group({
          id: [user.id],
          username:[user.username, [Validators.required, Validators.minLength(2)]],
          email: [user.email],
          nom: [user.nom, Validators.required],
          prenom: [user.prenom, Validators.required],
          enabled: [user.enabled],
          idRole:[user.idRole],
          adm: [isAdmin],
          modelRoles: [selected],
          cabinetId:[user?.cabinet?.id],
          superviseurId:[]
        }));
      }

      this.result = true;
    });
  }

  openModal(content: any, size: 'sm' | 'lg' = 'lg', centered: boolean = false) {
    this.modalService.open(content, { size, centered });
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
      this.showSuccess('Modification effectuée avec succès');
      setTimeout(() => (this.saveSuccess = false), 3000);
      this.loadUsers();
    }, error => {
      this.saveFail = true;
      this.loading = false;
      this.showError('Échec de la modification');
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

  setFilteredBons() {
    this.configPagination.currentPage = 1;
  }

  pageChange(newPage: number) {
    this.configPagination.currentPage = newPage;
  }

  openScrollableModal(content: TemplateRef<NgbModal>): void {
    //this.utilisateurForm.reset();
    this.modalService.open(content,
       {size: 'lg', // set modal size
        centered: true ,scrollable: true ,
        backdrop: 'static', // disable modal from closing on click outside
        keyboard: false,
        ariaLabelledBy: 'modal-basic-title'}).result.then((result)=> { 
           this.closeResult = `Closed with: ${result}`; 
         }, (reason) => { 
           this.closeResult =  
              `Dismissed ${this.getDismissReason(reason)}`; 
         });
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
  showSuccess(message: string) {
    this.toastr.success(message, 'Succès', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }

  showError(message: string) {
    this.toastr.error(message, 'Erreur', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }
  showWarning(message: string){
    this.toastr.warning(message+'!', 'Warning', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar:true,
      closeButton: true
    });
  }
}