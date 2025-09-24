import { SectionAnalytiqueDTO } from 'src/app/models/section-analytique.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SectionAnalytiqueService } from 'src/app/services/section-analytique/section-analytique.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { PlansAnalytiquesService } from 'src/app/services/plans-analytiques/plans-analytiques.service';
import { PlanAnalytique } from 'src/app/models/plan-analytique.model';

@Component({
  selector: 'app-sections-analytiques.component',
  templateUrl: './sections-analytiques.component.html',
  styleUrl: './sections-analytiques.component.scss',
  standalone: false
})
export class SectionsAnalytiquesComponent implements OnInit {

  @ViewChild('modalContent') modalContent!: TemplateRef<any>;

  sections: SectionAnalytiqueDTO[] = [];
  sectionForm!: UntypedFormGroup;

  plans: any[] = [];
  selectedIndex: number | null = null;
  formVisible = false;
  closeResult = '';
  pageTitle: BreadcrumbItem[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private sectionService: SectionAnalytiqueService,
    private planAnalytiqueService: PlansAnalytiquesService,
    private notification: NotificationService,
    private modalService: NgbModal
  ) {
    this.sectionForm = this.fb.group({
      id: [null],
      planAnalytiqueId: [null, Validators.required],
      intitule: ['', [Validators.required, Validators.pattern(/^[\p{L}\p{M}\d\s\-']+$/u)]],
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos sections analytiques', path: '/', active: true }];
    this.loadSections();
    this.chargerPlansAnalytiques()
  }

  chargerPlansAnalytiques() {
    this.planAnalytiqueService.getAllPlanAnalytique().subscribe(
      {
        next: (data: PlanAnalytique[]) => {
          this.plans = data.map(d => ({
            id: d.id,
            intitule: d.intitule,
          }));
        },
        error: (error: any) => {
          console.log('Erreur lors du chargement des plans analytiques', error);
          this.notification.showError("erreur lors du chargement des plans analytiques");
        }
      }
    );
  }

  loadSections(): void {
    this.sectionService.getAllSectionAnalytiques().subscribe({
      next: (data: SectionAnalytiqueDTO[]) => this.sections = data,
      error: (err) => this.notification.showError('Erreur lors du chargement des sections')
    });
  }

  openModal(): void {
    this.formVisible = true;
    this.sectionForm.reset();
    this.selectedIndex = null;
    this.modalService.open(this.modalContent, { centered: true });
  }

  editSection(index: number): void {
    this.selectedIndex = index;
    const section = this.sections[index];
    this.sectionForm.patchValue(section);
    this.formVisible = true;
    this.modalService.open(this.modalContent, { centered: true });
  }

  deleteSection(index: number): void {
    const section = this.sections[index];
    Swal.fire({
      title: 'Supprimer la section',
      text: `Voulez-vous vraiment supprimer ${section.libelle} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then(result => {
      if (result.isConfirmed) {
        this.sectionService.supprimerSectionAnalytique(section.id!).subscribe({
          next: () => {
            this.sections.splice(index, 1);
            this.notification.showSuccess('Section supprimée avec succès');
          },
          error: (error) => this.notification.showError(error)
        });
      }
    });
  }

  saveSection(): void {
    if (this.sectionForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    const payload = this.sectionForm.value;

    if (this.selectedIndex !== null) {
      // Update
      const sectionId = this.sections[this.selectedIndex].id!;
      this.sectionService.modifierSectionAnalytique(sectionId, payload).subscribe({
        next: (updated) => {
          this.sections[this.selectedIndex!] = updated;
          this.notification.showSuccess('Section modifiée avec succès');
          this.modalService.dismissAll();
        },
        error: (err) => this.notification.showError(err)
      });
    } else {
      // Create
      this.sectionService.creerSectionAnalytique(payload).subscribe({
        next: (created) => {
          this.sections.push(created);
          this.notification.showSuccess('Section créée avec succès');
          this.modalService.dismissAll();
        },
        error: (err) => this.notification.showError(err)
      });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.sectionForm.reset();
    this.selectedIndex = null;
    this.formVisible = false;
  }

}
