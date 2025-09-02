import { Component, OnInit } from '@angular/core';
import { NatureOperationService } from 'src/app/services/nature-operation/nature-operation.service';
import { CategorieService } from 'src/app/services/categories/categorie.service';
import { PlanComptableService } from 'src/app/services/plan-comptable/plan-comptable.service';
import {UntypedFormGroup,Validators,UntypedFormBuilder } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import Swal from 'sweetalert2';
import { NatureOperation } from 'src/app/models/nature-operation.model';
import { Select2Data } from 'ng-select2-component';
import { CodeJournal } from 'src/app/models/code-journal.model';
import { NotificationService } from 'src/app/services/notifications/notifications-service';
import { TypeCategorieService } from 'src/app/services/type-categorie/type-categorie.service';
import { TypeCategorie } from 'src/app/models/type-categorie.model';
@Component({
    selector: 'app-nature-operations',
    templateUrl: './nature-operations.component.html',
    styleUrls: ['./nature-operations.component.scss'],
    standalone: false
})
export class NatureOperationsComponent implements OnInit {
  natureList: NatureOperation[] = [];
  selected?: NatureOperation | null;

  // Utilisation de FormGroup[] avec typage clair
  natureOperations: UntypedFormGroup[] = [];
  lignes: UntypedFormGroup[] = [];

  analytiques: Select2Data = [];
  comptables: Select2Data = [];
  categories:any[]=[];
  listeSens=[{id:'CREDIT',libelle:'CREDIT'},{id:'DEBIT',libelle:'DEBIT'}];
  codesjournaux: CodeJournal[] =[];

  types: any[] = [];

  selectedTypeNature='';
        
  selectedIndex: number | null = null;
  natureOperationForm!: UntypedFormGroup;
  pageTitle: BreadcrumbItem[] = [];

  loading = false;
  isLoading = false;
  result = false;
  formVisible = false;

  isExploitation = false;
  isType = false;
  isTresorerie = false;
  prefixe:string;
  selectedCategorie: any; // pour stocker l'objet complet sélectionné
  typesFiltres: TypeCategorie[] = [];
  lastTypeId: any;

  constructor(
    private natureOperationService: NatureOperationService,
    private categorieService:CategorieService,
    private planComptableService:PlanComptableService,
    private fb: UntypedFormBuilder,
    private notification: NotificationService,
    private typeCategorieService: TypeCategorieService
    
  ) {
    this.natureOperationForm = this.fb.group({
      id: [],
      code: ['', Validators.required],
      libelle: ['', [Validators.required, Validators.minLength(2)]],
      compteComptable: ['',Validators.required],
      sectionAnalytique: [''],
      codeJournal:[],
      categorieId: [null, Validators.required],
      categorieLibelle:[''],
      categorieType:[''],
      societeId: [1],
      typeNature:[null],
      sensParDefaut:[],
      compteContrePartie:['']
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Vos natures opérations', path: '/', active: true }];
    this.chargerNatureOperations();
    this.chargerCategories();
    this.chargerAnalytiques();
    this.chargerCodeJournal();
    this.chargerTypesCategorie;
  }

  chargerTypesCategorie() {
    this.typeCategorieService.getAll().subscribe({
      next: (data: any[]) => {
        this.types = data.map(t => ({ id: t.id, code: t.code, libelle: t.libelle }));
        this.lastTypeId = data[data.length - 1].id;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types', err);
        this.notification.showError("Erreur lors du chargement des types");
      }
    });
  }
  onTypePrincipalChange(): void {
    const type = this.selectedCategorie?.type;
  
    const directTypes = ['RECETTE', 'SALAIRE'];
    const depenseTypes = ['EXPLOITATION', 'IMMOBILISATION'];
    const tresorerieTypes = ['DECAISSEMENT', 'ENCAISSEMENT'];
  
    if (directTypes.includes(type)) {
      this.natureOperationForm.patchValue({ typeNature: type });
      this.selectedTypeNature = type;
      this.isType = false;
      this.typesFiltres = [];
    } else if (type === 'DEPENSE') {
      this.isType = true;
      this.typesFiltres = this.types.filter(t => depenseTypes.includes(t.id));
    } else if (type === 'TRESORERIE') {
      this.isType = true;
      this.isTresorerie=true;
      this.typesFiltres = this.types.filter(t => tresorerieTypes.includes(t.id));
    } else {
      this.selectedTypeNature = '';
      this.isType = false;
      this.typesFiltres = [];
    }
  }
  

  onTypeChange(): void {
    const selected = this.natureOperationForm.get('typeNature')?.value;
    this.selectedTypeNature = selected;
    this.isExploitation = selected === 'EXPLOITATION';
    console.log(selected)
    if (selected !== 'EXPLOITATION') {
      this.natureOperationForm.patchValue({ sectionAnalytique: '' });
    }
    // Définir le préfixe selon le type sélectionné
    const prefixMap: { [key: string]: string } = {
      DEPENSE: '62',
      EXPLOITATION: '6',
      IMMOBILISATION: '2',
      RECETTE: '7',
      SALAIRE: '4',
      ENCAISSEMENT: '5',
      DECAISSEMENT: '5'
    };
    this.prefixe = prefixMap[this.selectedTypeNature] || '';
    if (this.prefixe) {
      this.comptables = [];
      this.chargerComptables(); // décommenter si nécessaire
    }
  }
  
  
  onCategorieChange(): void {
    // Reset du champ secondaire
    this.natureOperationForm.patchValue({
      typeNature: null,
      sectionAnalytique: ''
    });
  
    this.onTypeChange(); // met à jour isExploitation
  
    const selectedId = this.natureOperationForm.get('categorieId')?.value;
    if (!selectedId) return;
  
    // Récupération de la catégorie sélectionnée
    this.selectedCategorie = this.categories.find(c => c.id === +selectedId);
    if (!this.selectedCategorie) return;
  
    console.log('Catégorie sélectionnée :', this.selectedCategorie.type);
  
    // Mise à jour des types liés
    this.onTypePrincipalChange();
  
    // Mise à jour du champ form
    this.natureOperationForm.patchValue({ categorieId: selectedId });
  
    // Définir le préfixe selon le type sélectionné
    const prefixMap: { [key: string]: string } = {
      DEPENSE: '62',
      EXPLOITATION: '6',
      IMMOBILISATION: '2',
      RECETTE: '7',
      SALAIRE: '4',
      ENCAISSEMENT: '5',
      DECAISSEMENT:'5'
    };
  
    this.prefixe = prefixMap[this.selectedTypeNature] || '';
    console.log('Préfixe:', this.prefixe);
  
    if (this.prefixe) {
      this.comptables = [];
       this.chargerComptables(); // décommenter si nécessaire
    }
  }
  
  
  
  ajouter(): void {
    this.natureOperationForm.reset();
    this.natureOperationForm.patchValue({
      societeId: 1
    });
    // this.natureOperationForm.patchValue({
    //   typeNature:['NEUTRE']
    // });
    this.formVisible = true;
    this.selectedIndex = null;
    this.selected =null;
  }

  modifier(): void {
    if (this.selectedIndex !== null) {
      this.formVisible = true;
    }
  }

  supprimer(): void {
    if (this.selectedIndex !== null) {
      const currentData = this.lignes[this.selectedIndex].value as NatureOperation;
      this.natureOperationForm.setValue(currentData);
      this.lignes.splice(this.selectedIndex, 1);
      this.selectedIndex = null;
      this.deleteNatureOperation(currentData);
    }
  }

  edit(nature: NatureOperation): void {
    this.selected = { ...nature };
    this.natureOperationForm.patchValue(this.selected);
    this.formVisible = true;
  }

  fermer(): void {
    this.formVisible = false;
    this.selectedIndex = null;
    this.natureOperationForm.reset();
  }

  selectLigne(index: number): void {
    this.selectedIndex = index;
    const currentData = this.lignes[this.selectedIndex].value as NatureOperation;
    //console.log(currentData)
    this.natureOperationForm.setValue(currentData);
    this.natureOperationForm.patchValue({
      categorieId: currentData.categorieId
    });
    
    const prefixMap: { [key: string]: string } = {
      DEPENSE: '62',
      EXPLOITATION: '6',
      IMMOBILISATION: '2',
      RECETTE: '7',
      SALAIRE: '4',
      ENCAISSEMENT: '5',
      DECAISSEMENT: '5'
    };
  
    this.prefixe = prefixMap[currentData.typeNature|| ''] || '';
    //console.log(this.prefixe)|| ''] || ''
    if (this.prefixe) {
      this.comptables =[];
      this.chargerComptables();
    }
    this.selected = currentData;
  }

  enregistrer(): void {
    //   console.log(this.natureOperationForm.value)
    //  return;
    if (this.natureOperationForm.invalid) {
      this.notification.showWarning('Formulaire invalide');
      return;
    }

    this.isLoading = true;

    const natureOperation = this.natureOperationForm.value as NatureOperation;

    const action$ = this.selected?.id
      ? this.natureOperationService.update(this.selected.id, natureOperation)
      : this.natureOperationService.create(natureOperation);

    action$.subscribe({
      next: () => {
        const msg = this.selected?.id ? 'Modifié' : 'Enregistré';
        this.notification.showSuccess(`${msg} avec succès`);
        this.formVisible = false;
        this.natureOperationForm.reset();
        this.loading = false;
        this.selectedIndex = null;
        this.selected = undefined;
        this.lignes = [];
        this.chargerNatureOperations();
      },
      error: () => {
        this.loading = false;
        this.notification.showError('Erreur serveur !!!');
      }
    });
  }

  chargerNatureOperations(): void {
    this.natureOperations = [];
    this.natureOperationService.getAll().subscribe({
      next: (data: NatureOperation[]) => {
        //console.log(data)
        this.natureOperations = data.map(d =>
          this.fb.group({
            id: [d.id],
            code: [d.code],
            libelle: [d.libelle],
            compteComptable: [d.compteComptable],
            sectionAnalytique: [d.sectionAnalytique],
            codeJournal:[d.codeJournal],
            categorieId: [d.categorieId],
            categorieLibelle:[d.categorieLibelle],
            categorieType:[d.categorieType],
            societeId:[d.societeId],
            typeNature:[d.typeNature],
            sensParDefaut:[d.sensParDefaut],
            compteContrePartie:[d.compteContrePartie]
          })
        );
        this.lignes = this.natureOperations;
        this.result = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des natures opérations', error);
        this.result = true;
        this.isLoading = false;
        this.notification.showError('Erreur de chargement');
      }
    });
  }

  chargerCodeJournal() {
    this.natureOperationService.getAllCodeJournal().subscribe(
      {
        next:(data:any) => {
          this.codesjournaux=data;
          this.result=true;
        },
        error:(error:any) => {
          this.result=true;
          console.log('Erreur lors du chargement des codes journaux', error);
          this.notification.showError("erreur lors du chargement des codes journaux");
        }
      }
    );
  }

  chargerCategories() {
    this.categorieService.getAllCategories().subscribe(
      {
        next:(data:any) => {
          this.categories=data;
          this.result=true;
        },
        error:(error:any) => {
          this.result=true;
          console.log('Erreur lors du chargement des categories', error);
          this.notification.showError("erreur lors du chargement des categories");
        }
      }
    );
  }

  chargerComptables() {
    this.planComptableService.getAllParPrefixe(this.prefixe).subscribe(
      (data:any) => {
        for(let d of data){
          //console.log(data)
          this.comptables = [{ label: '', options: (data as any[]).map(d => ({ value: d.compte, label: d.compte+' - '+d.intitule })) }];
        }
        //this.isLoading=true;
      },
      (error) => {
        //this.isLoading=true;
        console.error('Erreur lors du chargement des comptes comptables', error);
        this.notification.showError("erreur..");
      }
    );
  }
  chargerAnalytiques() {
    this.planComptableService.getAllPlanAnalytique().subscribe(
      (data:any) => {
        for(let d of data){
          //console.log(data)
          this.analytiques = [{ label: '', options: (data as any[]).map(d => ({ value: d.sectionAnalytique, label: d.intitule })) }];
        }
        //this.isLoading=true;
      },
      (error) => {
        //this.isLoading=true;
        console.error('Erreur lors du chargement des tiers', error);
        this.notification.showError("erreur..");
      }
    );
  }

  deleteNatureOperation(nature: NatureOperation): void {
    Swal.fire({
      title: 'Supprimer la Nature Opération',
      html: `
        <p><strong>Nature : </strong><span style="color: #009879; font-size: 1.2em;">${nature.libelle}</span></p>
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
        this.natureOperationService.delete(nature.id!).subscribe({
          next: () => {
            this.natureOperations = [];
            this.chargerNatureOperations();
            Swal.fire('Succès', 'Nature supprimée avec succès.', 'success');
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

}