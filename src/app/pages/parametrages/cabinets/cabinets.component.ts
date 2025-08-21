import { Component, OnInit ,ViewChild,TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SocieteService } from 'src/app/services/societe.service';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { Societe } from 'src/app/models/societe.model';

@Component({
    selector: 'app-cabinets',
    templateUrl: './cabinets.component.html',
    styleUrls: ['./cabinets.component.scss'],
    standalone: false
})
export class CabinetsComponent implements OnInit {
  @ViewChild('content', { static: true }) content: any;
  @ViewChild('editcontent', { static: true }) editcontent: any;
  closeResult:string='';
  cabinetsList: Societe[] = [];
  selected?: Societe;

  // Utilisation de FormGroup[] avec typage clair
  cabinets: UntypedFormGroup[] = [];
  lignes: UntypedFormGroup[] = [];

  selectedIndex: number | null = null;
  cabinetForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;
  formVisible = false;

  pays:any[]=[];

  constructor(
    private societeService: SocieteService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.cabinetForm = this.fb.group({
      id: [''],
      nom: ['', Validators.required],
      telephone: [],
      email: ['', Validators.required],
      adresse:[],
      numeroIFU: [],
      paysId: [],
      paysNom:['']
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'cabinets', path: '/', active: true }];
    this.chargerCabinets();
    this.chargerPays();
  }

  ajouter(): void {
    this.cabinetForm.reset();
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
      this.cabinetForm.setValue(currentData);
      this.lignes.splice(this.selectedIndex, 1);
      this.selectedIndex = null;
      this.deleteCabinet(currentData);
    }
  }


  fermer(): void {
    this.formVisible = false;
    this.selectedIndex = null;
    this.cabinetForm.reset();
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    const currentData = this.lignes[this.selectedIndex].value as Societe;
    this.cabinetForm.setValue(currentData);
    //console.log(currentData)
    this.selected = currentData;
  }

  enregistrer(): void {
    if (this.cabinetForm.invalid) {
      this.showWarning('Formulaire invalide');
      return;
    }

    this.isLoading = true;

    const cabinet = this.cabinetForm.value as Societe;

    if (!cabinet) return; // sécurité si cabinet est null ou undefined

  const action$ = (this.selected && this.selected.id !== undefined)
  ? this.societeService.updateCabinet(this.selected.id, cabinet)
  : this.societeService.createCabinet(cabinet);

    action$.subscribe({
      next: () => {
        const msg = this.selected ? 'Modifié' : 'Enregistré';
        this.showSuccess(`${msg} avec succès`);
        this.formVisible = false;
        this.cabinetForm.reset();
        this.loading = false;
        this.selectedIndex = null;
        this.selected = undefined;
        this.lignes = [];
        this.chargerCabinets();
      },
      error: () => {
        this.loading = false;
        this.showError('Erreur serveur !!!');
      }
    });
  }

  chargerCabinets(): void {
    this.cabinets = [];
    this.societeService.getAllCabinet().subscribe({
      next: (data: Societe[]) => {
        //console.log(data)
        this.cabinets = data.map(d =>
          this.fb.group({
            id: [d.id],
            nom: [d.nom, Validators.required],
            telephone: [d.telephone],
            email: [d.email],
            adresse:[d.adresse],
            numeroIFU: [d.numeroIFU],
            paysId: [d.paysId],
            paysNom:[d.paysNom]
          })
        );
        this.lignes = this.cabinets;
        this.result = true;
        this.loading = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des cabinets', error);
        this.result = true;
        this.isLoading = false;
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

  deleteCabinet(cabinet: Societe): void {
    Swal.fire({
      title: 'Supprimer le cabinet',
      html: `
        <p><strong>cabinet : </strong><span style="color: #009879; font-size: 1.2em;">${cabinet.nom}</span></p>
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
        this.societeService.deleteCabinet(cabinet.id!).subscribe({
          next: () => {
            this.cabinets = [];
            this.chargerCabinets();
            Swal.fire('Succès', 'cabinet supprimé avec succès.', 'success');
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


