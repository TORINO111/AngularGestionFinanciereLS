import { TopbarComponent } from './../../../layout/shared/topbar/topbar.component';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SocieteService } from 'src/app/services/societe/societe.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { Societe } from 'src/app/models/societe.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { User } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-cabinets',
  templateUrl: './cabinets.component.html',
  styleUrls: ['./cabinets.component.scss'],
  standalone: false
})
export class CabinetsComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  @ViewChild('searchInputNom', { static: true }) searchInputNom!: ElementRef<HTMLInputElement>;
  @ViewChild('searchInputTel', { static: true }) searchInputTel!: ElementRef<HTMLInputElement>;

  currentUser: any;
  currentSociete: any;

  selectedPays?: number;
  private search$ = new Subject<{ nom: string; tel: string; pays?: number }>();
  searchNom: string = '';
  searchTel: string = '';

  totalElements: number = 0;
  pageSize: number = 1;
  currentPage: number = 0;

  closeResult: string = '';
  cabinetsList: Societe[] = [];
  selected?: Societe;

  lignes: any[] = [];
  categories: any[] = [];

  selectedIndex: number | null = null;
  cabinetForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;

  pays: any[] = [];
  isFormReady = false;
  societeBi: any;

  constructor(
    private societeService: SocieteService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private authService: AuthenticationService,
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
      paysNom: [null],
      societeId: [null],
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'cabinets', path: '/', active: true }];
    const societeActiveStr = localStorage.getItem("societeActive");
    if (societeActiveStr) {
      this.societeBi = JSON.parse(societeActiveStr);
      // Patch des valeurs dans les formulaires
      this.cabinetForm.patchValue({ societeId: this.societeBi.id });
    }
    this.chargerCabinets();
    this.chargerPays();
    this.initSearchListener();
  }

  onFilterChange(): void {
    this.search$.next({ nom: this.searchNom, tel: this.searchTel, pays: this.selectedPays });
  }

  private initSearchListener(): void {
    this.search$
      .pipe(
        debounceTime(300),
        switchMap(({ nom, tel, pays }) => {
          this.currentPage = 0;
          return this.societeService.getCabinets(
            0,
            this.pageSize,
            nom || undefined,
            tel || undefined,
            pays || undefined
          );
        })
      )
      .subscribe({
        next: data => {
          console.log(data)
          this.lignes = data.content;
          this.totalElements = data.totalElements;
          this.currentPage = 0;
        },
        error: err => console.error('Erreur lors de la recherche', err)
      });
  }

  ajouter(): void {
    this.cabinetForm.reset();
    this.selectedIndex = null;
    this.selected = undefined;
  }

  fermer(): void {
    this.selectedIndex = null;
    this.cabinetForm.reset();
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

  // chargerCabinets(): void {
  //   this.lignes = [];
  //   this.societeService.getAllCabinet().subscribe({
  //     next: (data: Societe[]) => {
  //       this.lignes = data.map(d =>
  //         this.fb.group({
  //           id: [d.id],
  //           nom: [d.nom, Validators.required],
  //           telephone: [d.telephone],
  //           email: [d.email, [Validators.required, Validators.email]],
  //           adresse: [d.adresse],
  //           numeroIFU: [d.numeroIFU],
  //           numeroRccm: [d.numeroRccm],
  //           paysId: [d.paysId],
  //           paysNom: [d.paysNom]
  //         })
  //       );
  //       this.result = true;
  //       this.loading = false;
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors du chargement des cabinets', error);
  //       this.result = true;
  //       this.isLoading = false;
  //       this.loading = false;
  //       this.notification.showError('Erreur de chargement');
  //     }
  //   });
  // }

  chargerCabinets(page: number = 0) {
    this.result = false;
    this.currentPage = page;

    this.societeService.getCabinets(
      page,
      this.pageSize,
      this.searchNom ? this.searchNom : undefined,
      this.searchTel ? this.searchTel : undefined,
      this.selectedPays ? this.selectedPays : undefined
    )
      .subscribe({
        next: (data) => {
          this.categories = data.content;
          this.lignes = [...this.categories];
          this.totalElements = data.totalElements;
          this.result = true;
        },
        error: (error) => {
          this.result = true;
          console.error("Erreur lors du chargement des cabinets:", error);
        }
      });
  }

  pages(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  goToPage(page: number) {
    this.chargerCabinets(page);
  }

  totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
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

  // openEditModal(editcontent: TemplateRef<NgbModal>): void {
  //   this.modalService.open(editcontent,
  //     {
  //       size: 'lg',
  //       centered: true, scrollable: true,
  //       backdrop: 'static',
  //       keyboard: false,
  //       ariaLabelledBy: 'modal-basic-title'
  //     }).result.then((result) => {
  //       this.closeResult = `Closed with: ${result}`;
  //     }, (reason) => {
  //       this.closeResult =
  //         `Dismissed ${this.getDismissReason(reason)}`;
  //     });
  // }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return 'with: ${reason}';
    }
  }

  modifier(): void {
    if (this.selectedIndex === null) return;
    const cabinet = this.lignes[this.selectedIndex].value;
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
    this.openModal();
  }

  supprimer(): void {
    if (this.selectedIndex === null) return;
    const cabinet = this.lignes[this.selectedIndex].value;
    this.deleteCabinet(cabinet);
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    this.selected = this.lignes[index].value;
  }


  openModal(): void {
    this.cabinetForm.reset();
    this.selectedIndex = null;
    this.modalService.open(this.modalContent, { centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.cabinetForm.reset();
    this.selectedIndex = null;
  }

  editCabinet(index: number): void {
    this.selectedIndex = index;
    if (!this.currentSociete) {
      console.warn('Société non encore chargée, impossible d’éditer');
      return;
    }
    const cabinet = this.lignes[index];
    this.cabinetForm.patchValue({cabinet});
    this.modalService.open(this.modalContent, { centered: true });
  }

  deleteCabinetConfirm(index: number): void {
    const cabinet = this.lignes[index].value;

    Swal.fire({
      title: 'Supprimer le cabinet',
      html: `<p><strong>Cabinet : </strong><span style="color: #009879; font-size: 1.2em;">${cabinet.nom}</span></p>`,
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
      if (result.isConfirmed) {
        this.societeService.deleteCabinet(cabinet.id!).subscribe({
          next: () => {
            this.lignes.splice(index, 1);
            Swal.fire('Succès', 'Cabinet supprimé avec succès.', 'success');
          },
          error: (err) => {
            const msg = err.error?.message || err.message || 'Une erreur est survenue.';
            Swal.fire('Erreur', msg, 'error');
          }
        });
      }
    });
  }

}