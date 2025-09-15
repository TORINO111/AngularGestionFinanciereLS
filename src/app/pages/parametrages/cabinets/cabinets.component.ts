import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SocieteService } from 'src/app/services/societe/societe.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { Societe } from 'src/app/models/societe.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';

@Component({
  selector: 'app-cabinets',
  templateUrl: './cabinets.component.html',
  styleUrls: ['./cabinets.component.scss'],
  standalone: false
})
export class CabinetsComponent implements OnInit {
  @ViewChild('content', { static: true }) content: any;
  @ViewChild('editcontent', { static: true }) editcontent: any;
  closeResult: string = '';
  cabinetsList: Societe[] = [];
  selected?: Societe;

  lignes: UntypedFormGroup[] = [];

  selectedIndex: number | null = null;
  cabinetForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;
  formVisible = false;

  pays: any[] = [];

  constructor(
    private societeService: SocieteService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private notification: NotificationService
  ) {
    this.cabinetForm = this.fb.group({
      id: [null],  
      nom: ['', Validators.required],
      telephone: [],
      email: ['', [Validators.required, Validators.email]],
      adresse: [],
      numeroIFU: ['', [Validators.required]],
      numeroRccm: ['', [Validators.required]],
      paysId: [],
      paysNom: [null]
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
    this.selected = undefined;
  }

  modifier(): void {
    if (this.selectedIndex === null) { return; }

    const cabinet = this.lignes[this.selectedIndex].value;

    this.formVisible = true;

    this.cabinetForm.patchValue({
      id: cabinet.id,
      nom: cabinet.nom,
      adresse: cabinet.adresse,
      telephone: cabinet.telephone,
      email: cabinet.email,
      numeroIFU: cabinet.numeroIFU,
      numeroRccm: cabinet.numeroRccm,
      paysId: cabinet.paysId
    });
}


  supprimer(): void {
    if (this.selectedIndex !== null && this.lignes[this.selectedIndex]) { 
      const currentData = this.lignes[this.selectedIndex].value;
      this.cabinetForm.setValue(currentData);
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
    if (this.lignes[index]) {
      const currentData = this.lignes[index].value as Societe;
      this.cabinetForm.setValue(currentData);
      this.selected = currentData;
    } else {
      console.error('Ligne non trouvée à l\'index :', index);
    }
  }

  enregistrer(): void {
    if (this.cabinetForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      this.cabinetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const cabinet = this.cabinetForm.value;

    console.log(cabinet);

    const id = this.cabinetForm.get('id')?.value;
    const isUpdate = id !== null && id !== undefined && id !== '';

    const action$ = isUpdate
      ? this.societeService.updateCabinet(this.cabinetForm.value.id, cabinet)
      : this.societeService.createCabinet(cabinet);

    action$.subscribe({
      next: () => {
        const msg = isUpdate ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`${msg} avec succès`);
        this.formVisible = false;
        this.cabinetForm.reset();
        this.isLoading = false;
        this.selectedIndex = null;
        this.selected = undefined;
        this.lignes = [];
        this.chargerCabinets();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.notification.showError(error);
      }
    });
  }

  chargerCabinets(): void {
    this.lignes = [];
    this.societeService.getAllCabinet().subscribe({
      next: (data: Societe[]) => {
        this.lignes = data.map(d =>
          this.fb.group({
            id: [d.id],
            nom: [d.nom, Validators.required],
            telephone: [d.telephone],
            email: [d.email, [Validators.required, Validators.email]],
            adresse: [d.adresse],
            numeroIFU: [d.numeroIFU],
            numeroRccm: [d.numeroRccm],
            paysId: [d.paysId],
            paysNom: [d.paysNom]
          })
        );
        this.result = true;
        this.loading = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des cabinets', error);
        this.result = true;
        this.isLoading = false;
        this.loading = false;
        this.notification.showError('Erreur de chargement');
      }
    });
  }

  chargerPays() {
    this.societeService.getAllPays().subscribe(
      {
        next: (data: any) => {
          this.pays = data;
          this.result = true;
        },
        error: (error: any) => {
          this.result = true;
          console.log('Erreur lors du chargement des pays', error);
          this.notification.showError("erreur lors du chargement des pays");
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
            this.lignes = this.lignes.filter(f => f.value.id !== cabinet.id);
            this.chargerCabinets();
            Swal.fire('Succès', 'cabinet supprimé avec succès.', 'success');
          },
          error: (err) => {
            const msg = err.error?.message || err.message || 'Une erreur s\'est produite.';
            Swal.fire('Erreur', msg, 'error');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Abandonné', 'Suppression annulée', 'info');
      }
    });
  }

  openScrollableModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content,
      {
        size: 'lg',
        centered: true, scrollable: true,
        backdrop: 'static',
        keyboard: false,
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  openEditModal(editcontent: TemplateRef<NgbModal>): void {
    this.modalService.open(editcontent,
      {
        size: 'lg',
        centered: true, scrollable: true,
        backdrop: 'static',
        keyboard: false,
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result) => {
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


}