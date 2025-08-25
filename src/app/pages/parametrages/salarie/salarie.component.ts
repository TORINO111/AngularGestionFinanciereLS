import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Salarie } from 'src/app/models/salarie.model';
import { SalarieService } from 'src/app/services/salaries/salarie.service';
@Component({
    selector: 'app-salarie',
    templateUrl: './salarie.component.html',
    styleUrls: ['./salarie.component.scss'],
    standalone: false
})
export class SalarieComponent implements OnInit {

  form!: UntypedFormGroup;
  salaries: Salarie[] = [];

  constructor(private fb: UntypedFormBuilder, private salarieService: SalarieService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: [''],
      telephone: [''],
      poste: [''],
      matricule: [''],
      dateEmbauche: [''],
      dateDepart: [''],
      statut: ['', Validators.required],
      societeId: []
    });

    this.loadSalaries();
  }

  loadSalaries(): void {
    this.salarieService.getAll().subscribe(data => this.salaries = data);
  }

  submit(): void {
    const value = this.form.value;

    if (value.id) {
      this.salarieService.update(value.id, value).subscribe(() => this.loadSalaries());
    } else {
      this.salarieService.create(value).subscribe(() => this.loadSalaries());
    }

    this.form.reset();
  }

  edit(s: Salarie): void {
    this.form.patchValue(s);
  }

  delete(id: number): void {
    this.salarieService.delete(id).subscribe(() => this.loadSalaries());
  }

}
