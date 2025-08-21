import { Component, OnInit ,ViewChild,TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SocieteService } from 'src/app/services/societe.service';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { Societe } from 'src/app/models/societe.model';
import { UtilisateurService } from 'src/app/services/utilisateur.service';

@Component({
    selector: 'app-societes',
    templateUrl: './societes.component.html',
    styleUrls: ['./societes.component.scss'],
    standalone: false
})
export class SocietesComponent implements OnInit {

  @ViewChild('content', { static: true }) content: any;
  @ViewChild('editcontent', { static: true }) editcontent: any;
  closeResult:string='';
  societesList: Societe[] = [];
  selected: Societe | undefined;

  // Utilisation de FormGroup[] avec typage clair
  societes: UntypedFormGroup[] = [];
  lignes: UntypedFormGroup[] = [];

  selectedIndex: number | null = null;
  societeForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;
  formVisible = false;

  pays:any[]=[];
  comptables:any[]=[];

  constructor(
    private societeService: SocieteService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private utilisateurService:UtilisateurService
  ) {
    this.societeForm = this.fb.group({
      id: [''],
      nom: ['', Validators.required],
      telephone: [],
      email: [],
      adresse:[],
      numeroIFU: [],
      paysId: [4],
      paysNom:[''],
      comptableId: [],
      comptableNom:['']
    });
    this.chargerSocietes();
    this.chargerPays();
    this.chargerComptables();
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'sociétés', path: '/', active: true }];
    
  }

  ajouter(): void {
    this.societeForm.reset();
    this.formVisible = true;
    this.selectedIndex = null;
  }

  modifier(): void {
    if (this.selectedIndex !== null) {
      this.formVisible = true;
    }
  }

  supprimer(): void {
    if (this.selectedIndex !== null) {
      const currentData = this.lignes[this.selectedIndex].value as Societe;
      this.societeForm.setValue(currentData);
      this.lignes.splice(this.selectedIndex, 1);
      this.selectedIndex = null;
      this.deleteSociete(currentData);
    }
  }


  fermer(): void {
    this.formVisible = false;
    this.selectedIndex = null;
    this.societeForm.reset();
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    const currentData = this.lignes[this.selectedIndex].value as Societe;
    this.societeForm.setValue(currentData);
    console.log(currentData)
    this.selected = currentData;
  }

  enregistrer(): void {
    if (this.societeForm.invalid) {
      this.showWarning('Formulaire invalide');
      return;
    }

    this.isLoading = true;

    const societe = this.societeForm.value as Societe;

    let action$;

    if (this.selected && societe.id !== undefined) {
      // id existe : update
      action$ = this.societeService.updateSociete(societe.id, societe);
    } else {
      // sinon : création
      action$ = this.societeService.createSociete(societe);
    }

    action$.subscribe({
      next: () => {
        const msg = this.selected ? 'Modifié' : 'Enregistré';
        this.showSuccess(`${msg} avec succès`);
        this.formVisible = false;
        this.societeForm.reset();
        this.isLoading = false;
        this.loading = false;
        this.selectedIndex = null;
        this.selected = undefined;
        this.lignes = [];
        this.chargerSocietes();
      },
      error: () => {
        this.isLoading = false;
        this.loading = false;
        this.showError('Erreur serveur !!!');
      }
    });
  }

  chargerSocietes(): void {
    this.societes = [];
    this.societeService.getAllSociete().subscribe({
      next: (data: Societe[]) => {
        console.log(data)
        this.societes = data.map(d =>
          this.fb.group({
            id: [d.id],
            nom: [d.nom, Validators.required],
            telephone: [d.telephone],
            email: [d.email],
            adresse:[d.adresse],
            numeroIFU: [d.numeroIFU],
            paysId: [d.paysId],
            paysNom:[d.paysNom],
            comptableId: [d.comptableId],
            comptableNom:[d.comptableNom]
          })
        );
        this.lignes = this.societes;
        this.result = true;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des societes', error);
        this.result = true;
        this.loading = false;
        this.showError('Erreur de chargement');
      }
    });
  }

  chargerPays() {
    this.societeService.getAllPays().subscribe(
      {
        next:(data:any) => {
          this.pays=data;
          this.result=true;
        },
        error:(error:any) => {
          this.result=true;
          console.log('Erreur lors du chargement des pays', error);
          this.showError("erreur lors du chargement des pays");
        }
      }
    );
  }

  chargerComptables() {
    this.utilisateurService.allComptables().subscribe(
      {
        next:(data:any) => {
          this.comptables=data;
          this.result=true;
        },
        error:(error:any) => {
          this.result=true;
          console.log('Erreur lors du chargement des comptables', error);
          this.showError("erreur lors du chargement des comptables");
        }
      }
    );
  }

  deleteSociete(societe: Societe): void {
    Swal.fire({
      title: 'Supprimer le compte',
      html: `
        <p><strong>Societe : </strong><span style="color: #009879; font-size: 1.2em;">${societe.nom}</span></p>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fa fa-trash-alt"></i> Supprimer',
      cancelButtonText: '<i class="fa fa-ban"></i> Annuler',
      customClass: {
        popup: 'swal2-custom-popup',
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.societeService.deleteSociete(societe.id!).subscribe({
          next: () => {
            this.societes = [];
            this.chargerSocietes();
            Swal.fire('Succès', 'Societe supprimé avec succès.', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Une erreur s\'est produite.', 'error');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Abandonné', 'Suppression annulée', 'info');
      }
    });
  }

  

  openScrollableModal(content: TemplateRef<NgbModal>): void {
    //this.codeBudgetaireForm.reset();
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

    openEditModal(editcontent: TemplateRef<NgbModal>): void {
      this.modalService.open(editcontent,
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

  showSuccess(message: string): void {
    this.toastr.success(message, 'Succès', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }

  showError(message: string): void {
    this.toastr.error(message, 'Erreur', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }

  showWarning(message: string): void {
    this.toastr.warning(message, 'Attention', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }
}

