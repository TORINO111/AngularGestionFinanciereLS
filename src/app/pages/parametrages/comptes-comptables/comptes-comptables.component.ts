import { CompteComptableDTO } from 'src/app/models/compte-comptable';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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
  standalone: false
})
export class ComptesComptablesComponent {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  comptes: UntypedFormGroup[] = [];
  lignes: UntypedFormGroup[] = [];
  plansComptables: any[] = [];
  selectedIndex: number | null = null;
  tiersNatures: any[] = [{libelle:'CLIENT'}, {libelle:'FOURNISSEUR'}];

  pageTitle: BreadcrumbItem[] = [];

  compteForm: UntypedFormGroup;
  formVisible = false;
  isLoading = false;
  result = false;
  closeResult = '';
  classeComptes = [
    { value: 'CAPITAUX', label: 'Classe 1 : CAPITAUX' },
    { value: 'IMMOBILISATIONS', label: 'Classe 2 : IMMOBILISATIONS' },
    { value: 'STOCKS', label: 'Classe 3 : STOCKS' },
    { value: 'TIERS', label: 'Classe 4 : TIERS' },
    { value: 'FINANCIERS', label: 'Classe 5 : FINANCIERS' },
    { value: 'CHARGES', label: 'Classe 6 : CHARGES' },
    { value: 'PRODUITS', label: 'Classe 7 : PRODUITS' },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private compteService: CompteComptableService,
    private planService: PlanComptableService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.compteForm = this.fb.group({
      id: [''],
      numero: ['', Validators.required],
      intitule: ['', [Validators.required, Validators.minLength(3)]],
      planComptableId: ['', Validators.required],
      classeCompte: ['', Validators.required],
      tiersNature: [null]
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos comptes comptables', path: '/', active: true }];
    this.loadComptes();
    this.loadPlansComptables();
  }

  loadComptes(): void {
    this.comptes = [];
    this.compteService.getAll().subscribe({
      next: (data) => {
        this.comptes = data.map(d => this.fb.group({
          id: [d.id],
          numero: [d.numero],
          intitule: [d.intitule],
          planComptableId: [d.planComptableId],
          planComptableLibelle: [d.planComptableLibelle],
          classeCompte: [d.classeCompte]
        }));
        this.lignes = this.comptes;
      },
      error: (err) => {
        console.error('Erreur chargement comptes', err);
        this.toastr.error('Erreur chargement comptes');
      }
    });
  }

  loadPlansComptables(): void {
    this.planService.getAll().subscribe({
      next: (data) => this.plansComptables = data.map(p => ({ id: p.id, nom: p.intitule })),
      error: (err) => console.error('Erreur chargement plans', err)
    });
  }

  ajouter(): void {
    this.compteForm.reset();
    this.formVisible = true;
    this.selectedIndex = null;
  }

  modifier(): void {
    if (this.selectedIndex !== null) this.formVisible = true;
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    const current = this.lignes[index].value;
    this.compteForm.patchValue({
      id: current.id,
      numero: current.numero,
      intitule: current.intitule,
      planComptableId: current.planComptableId,
      classeCompte: current.classeCompte
    });
    this.formVisible = true;
  }

  supprimer(): void {
    if (this.selectedIndex !== null) {
      const current = this.lignes[this.selectedIndex].value;
      this.compteService.delete(current.id).subscribe({
        next: () => {
          this.toastr.success('Compte supprimé avec succès');
          this.loadComptes();
          this.formVisible = false;
          this.selectedIndex = null;
        },
        error: (err) => this.toastr.error('Erreur suppression compte')
      });
    }
  }

  enregistrer(): void {
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
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err)}
    });
  }

  openModal(): void {
    this.modalService.open(this.modalContent, { size: 'lg', centered: true });
  }

  fermer(): void {
    this.formVisible = false;
    this.selectedIndex = null;
    this.compteForm.reset();
  }
}
