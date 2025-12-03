import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { AuthenticationService } from "src/app/core/service/auth.service";
import { ExerciceComptableService } from "src/app/services/exercices-comptables/exercice-comptable.service";
import { SocieteSelectionService } from "src/app/services/societe-selection/societe-selection.service";
import { ExerciceComptable } from "../../../models/exercice-comptable.model";
import { BreadcrumbItem } from "../../../shared/page-title/page-title/page-title.model";
import { NotificationService } from "src/app/services/notifications/notifications-service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

@Component({
  selector: "app-gestion-exercice",
  templateUrl: "./gestion-exercice.component.html",
  styleUrls: ["./gestion-exercice.component.scss"],
  standalone: false,
})
export class GestionExerciceComponent implements OnInit {
  @ViewChild("modalContent", { static: true }) modalContent!: TemplateRef<any>;
  exercices: ExerciceComptable[] = [];
  societeId!: number;
  nouvelleAnnee: number = new Date().getFullYear();
  exerciceEnCours: boolean = false;
  exerciceForm: UntypedFormGroup;
  loading = false;
  pageTitle: BreadcrumbItem[] = [];
  result = false;
  user: any;
  selectedExercice: ExerciceComptable | null = null;

  constructor(
    private exerciceService: ExerciceComptableService,
    private societeSelectionService: SocieteSelectionService,
    private fb: UntypedFormBuilder,
    private notif: NotificationService,
    private modalService: NgbModal
  ) {
    this.exerciceForm = this.fb.group({
      id: [null],
      annee: [this.nouvelleAnnee, [Validators.required, Validators.min(2024)]],
      dateOuverture: [null, Validators.required],
      dateCloture: [null, Validators.required],
      userId: [null],
      cloture: [false],
    });
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: "Vos exercices", path: "/", active: true }];
    const userJson = sessionStorage.getItem("currentUser");
    const societeJson = sessionStorage.getItem("societeActive");

    this.societeId = societeJson ? JSON.parse(societeJson).id : null;
    this.user = userJson ? JSON.parse(userJson) : null;

    if (this.user && this.societeId) {
      this.exerciceForm.patchValue({ userId: this.user.id });
      this.exerciceForm.patchValue({ societeId: this.societeId });
      this.loadExercices();
    }
  }

  openModal(exercice?: ExerciceComptable): void {
    this.selectedExercice = exercice || null;
    this.exerciceForm.reset();
    if (exercice) {
      this.exerciceForm.patchValue(exercice);
      this.exerciceForm.patchValue({
        id: exercice.id,
        cloture: exercice.cloture,
      });
    }
    this.exerciceForm.patchValue({ userId: this.user.id });
    this.exerciceForm.patchValue({ societeId: this.societeId });
    this.modalService.open(this.modalContent, { centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  loadExercices(): void {
    this.exerciceService.findAllBySociete(this.societeId).subscribe({
      next: (data) => {
        //console.log(data)
        this.exercices = data.content ?? []; // <-- le tableau réel
        console.log("Exercices chargés :", this.exercices);

        this.exerciceEnCours = this.exercices.some((ex) => !ex.cloture);
        console.log("Exercice en cours :", this.exerciceEnCours);
        this.result = true;
      },
      error: () => {
        this.result = true;
        this.notif.showError("Erreur lors du chargement des exercices.");
        //alert('Erreur lors du chargement des exercices.')
      },
    });
  }

  enregistrer(): void {
    if (this.exerciceForm.invalid) {
      this.notif.showWarning("Formulaire invalide");
      return;
    }

    const exerciceData = this.exerciceForm.value;
    const action$ = exerciceData.id
      ? this.exerciceService.update(exerciceData.id, exerciceData)
      : this.exerciceService.creerExercice({
          ...exerciceData,
          societeId: this.societeId,
          userId: this.user.id,
          cloture: false,
        });

    action$.subscribe({
      next: () => {
        const msg = exerciceData.id ? "Modifié" : "Enregistré";
        this.notif.showSuccess(`Exercice ${msg} avec succès`);
        this.loadExercices();
        this.closeModal();
      },
      error: (err) => {
        this.notif.showError(err.error.message || "Une erreur est survenue");
      },
    });
  }

  deleteExercice(exercice: ExerciceComptable): void {
    Swal.fire({
      title: "Supprimer l'exercice",
      text: `Êtes-vous sûr de vouloir supprimer l'exercice de l'année ${exercice.annee} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.exerciceService.delete(exercice.id).subscribe({
          next: () => {
            this.notif.showSuccess("Exercice supprimé avec succès");
            this.loadExercices();
          },
          error: (err) => {
            this.notif.showError(
              err.error.message || "Une erreur est survenue"
            );
          },
        });
      }
    });
  }

  cloturerExercice(exercice: ExerciceComptable): void {
    Swal.fire({
      title: "Clôturer l’exercice",
      text: `Voulez-vous vraiment clôturer l’exercice ${exercice.annee} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, clôturer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.exerciceService.cloturerExercice(exercice.id!).subscribe({
          next: () => {
            this.notif.showSuccess("Exercice clôturé !");
            this.loadExercices();
          },
          error: (err) => {
            this.notif.showError(
              err.error?.message || "Erreur lors de la clôture."
            );
          },
        });
      }
    });
  }
}
