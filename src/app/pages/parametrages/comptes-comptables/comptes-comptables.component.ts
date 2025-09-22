import { CompteComptableDTO } from 'src/app/models/compte-comptable';
import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CompteComptableService } from 'src/app/services/comptes-comptables/comptes-comptables.service';
import { PlanComptableService } from 'src/app/services/plan-comptable/plan-comptable.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';

@Component({
  selector: 'app-comptes-comptables',
  templateUrl: './comptes-comptables.component.html',
  styleUrl: './comptes-comptables.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class ComptesComptablesComponent implements OnInit {

  @ViewChild('modalContent') modalContent!: TemplateRef<any>;

  comptes: UntypedFormGroup[] = [];
  lignes: UntypedFormGroup[] = [];
  plansComptables: any[] = [];
  selectedIndex: number | null = null;
  pageTitle: BreadcrumbItem[] = [];

  compteForm: UntypedFormGroup;
  formVisible = false;
  isLoading = false;

  constructor(
    private fb: UntypedFormBuilder,
    private compteService: CompteComptableService,
    private planService: PlanComptableService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.compteForm = this.fb.group({
      id: [''],
      numero: ['', [Validators.required, Validators.pattern(/^\d{1,4}$/)]],
      intitule: ['', [Validators.required, Validators.minLength(3)]],
      planComptableId: ['', Validators.required],
      classeCompte: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos comptes comptables', path: '/', active: true }];
    this.loadComptes();
    this.loadPlansComptables();
  }

  loadComptes(): void {
    this.isLoading = true;
    this.compteService.getAll().subscribe({
      next: (data) => {
        this.comptes = data.map(d => this.fb.group({
          id: [d.id],
          code: [d.codeComplet],
          numero: [d.numero],
          intitule: [d.intitule],
          planComptableId: [d.planComptableId],
          planComptableLibelle: [d.planComptableLibelle],
          classeCompte: [d.classeCompte]
        }));
        this.lignes = this.comptes;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erreur chargement comptes');
        this.isLoading = false;
      }
    });
  }

  loadPlansComptables(): void {
    this.planService.getAll().subscribe({
      next: (data) => this.plansComptables = data.map(p => ({ id: p.id, nom: p.intitule })),
      error: (err) => console.error('Erreur plans', err)
    });
  }

  openModal(): void {
    this.formVisible = true;
    this.compteForm.reset();
    this.selectedIndex = null;
    this.modalService.open(this.modalContent, { size: 'lg', centered: true });
  }

  editCompte(index: number): void {
    this.selectedIndex = index;
    const compte = this.lignes[index].value;
    this.compteForm.patchValue(compte);
    console.log(this.compteForm);

    this.modalService.open(this.modalContent, { centered: true });
  }

  deleteCompte(index: number): void {
    const compte = this.lignes[index].value;
    if (!compte?.id) return;
    if (!confirm(`Voulez-vous vraiment supprimer le compte "${compte.intitule}" ?`)) return;

    this.compteService.delete(compte.id).subscribe({
      next: () => {
        this.toastr.success('Compte supprimé avec succès');
        this.loadComptes();
      },
      error: () => this.toastr.error('Erreur suppression compte')
    });
  }

  saveCompte(): void {
    if (this.compteForm.invalid) {
      this.toastr.warning('Formulaire invalide');
      return;
    }
    const formValue = this.compteForm.value as CompteComptableDTO;
    const action$ = formValue.id
      ? this.compteService.update(formValue.id, formValue)
      : this.compteService.create(formValue);

    action$.subscribe({
      next: () => {
        this.toastr.success(`Compte ${formValue.id ? 'modifié' : 'créé'} avec succès`);
        this.compteForm.reset();
        this.formVisible = false;
        this.selectedIndex = null;
        this.loadComptes();
        this.modalService.dismissAll();
      },
      error: () => this.toastr.error('Erreur lors de l\'enregistrement')
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.compteForm.reset();
    this.selectedIndex = null;
    this.formVisible = false;
  }
}
