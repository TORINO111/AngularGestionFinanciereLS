import { Component, OnInit,ViewChild,TemplateRef } from '@angular/core';
import { TresorerieService } from 'src/app/services/tresorerie.service';
import { CategorieService } from 'src/app/services/categorie.service';
import {FormGroup,Validators,FormBuilder } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title/page-title.model';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss']
})
export class CategorieComponent implements OnInit {

  categories:any[]=[];
  categorieForm!: FormGroup;
  sousCategorieForm!: FormGroup;
  @ViewChild('content', { static: true }) content: any;
  @ViewChild('editcontent', { static: true }) editcontent: any;
  closeResult:string='';
  pageTitle: BreadcrumbItem[] = [];
  loading:boolean=false;
  result:boolean=false;
  types = [
    {id:'RECETTE',libelle:'Recette'}, {id:'DEPENSE',libelle:'Dépense'}, {id:'SALAIRE',libelle:'Salaire'}, {id:'TRESORERIE',libelle:'Trésorerie'}

];
  constructor(private categorieService: CategorieService,
    private modalService: NgbModal,private fb: FormBuilder,private toastr: ToastrService) {
      this.categorieForm = this.fb.group({
        id:[],
        code: ['', [Validators.required]],
        libelle: ['', [Validators.required,Validators.minLength(2)]],
        type:['', [Validators.required]]
        });
     }

  ngOnInit(): void {
    this.pageTitle = [ { label: '', path: '/', active: true }];
    
    this.chargerCategories();
  }


  chargerCategories() {
    this.categorieService.getAllCategories().subscribe(
      {
        next:(data:any) => {
          for(let d of data){
            this.categories.push(this.fb.group({
              id:d.id,
              code:d.code,
              libelle:d.libelle,
              type:d.type
            }));
          }
          this.result=true;
        },
        error:(error:any) => {
          this.result=true;
          console.log('Erreur lors du chargement des categories', error);
          this.showError("erreur lors du chargement des categories");
        }
      }
    );
  }

  onSaveCategorie(categorieFormValue){
    //console.log(categorieFormValue);
    if(categorieFormValue.valid){
    this.categorieService.creerCategorie(categorieFormValue.value).subscribe(
      {
        next: (response:any) => {
          this.showSuccess('Enregistré  avec succès');
          this.loading=false;
          console.log(response);
          this.categories=[];
          this.chargerCategories();
         },
        error: (error) => {
          console.log(error);
          this.loading=false;
          //this.errorMessage = error; // Handle the error message
        console.error('Error fetching data:', error);
          this.showError('Erreur serveur');  
        }
      }
      );
    }else{
      this.showWarning('formulaire invalide');
    }
  }

  deleteCategorie(categorieFormValue:any){
    Swal.fire({
      title: 'Supprimer la Categorie' ,
      html: `
        <div style="text-align: left; margin-bottom: 10px;">
        <p><strong></strong> <span style="color: #009879;font-size: 1.5em;">${categorieFormValue.libelle}</span></p>
       </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fa fa-trash-alt"></i> Supprimer',
      cancelButtonText: '<i class="fa fa-ban"></i> Annuler',
      customClass: {
        popup: 'swal2-custom-popup',
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
      buttonsStyling: false,
      
    }).then((result) => {
      if (result.value) {
        
        this.categorieService.supprimerCategorie(categorieFormValue.id).subscribe({
          next: (response:any) => {
            //console.log(response);
            this.categories=[];
            this.chargerCategories();
            Swal.fire('Succès', `La rubrique a été supprimée avec succès.`, 'success');
            
          },
          error: (err) => {
            console.log(err)
            Swal.fire('Erreur', `Une erreur s'est produite `, 'error');
          }
        });
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Abandonné',
          'Categorie non supprimée',
          'error'
        )
      }
    });

  }

  

  onUpdateCategorie(categorieFormValue){
    if(categorieFormValue.valid){
    this.categorieService.modifierCategorie(categorieFormValue.value.id,categorieFormValue.value).subscribe(
      {
        next: (data:any) => {
          this.showSuccess('Modifié  avec succès');
          this.loading=false;
          this.categories=[];
          this.chargerCategories();
          this.result=true;
         },
        error: (error) => {
          console.log(error);
          this.loading=false;
          this.showError('Erreur serveur ');  
        }
      }
      );
    }else{
      this.showWarning('formulaire invalide');
    }
  }

  

    showSuccess(message: string){
      this.toastr.success(message+'!', 'Success', {
        timeOut: 5000,
        positionClass: 'toast-top-right',
        progressBar:true,
        closeButton: true
      });
    }
    
    showError(message: string){
      this.toastr.error(message+'!', 'Error', {
        timeOut: 5000,
        positionClass: 'toast-top-right',
        progressBar:true,
        closeButton: true
      });
    }

    showWarning(message: string){
      this.toastr.warning(message+'!', 'Warning', {
        timeOut: 5000,
        positionClass: 'toast-top-right',
        progressBar:true,
        closeButton: true
      });
    }
  openScrollableModal(content: TemplateRef<NgbModal>): void {
    this.categorieForm.reset();
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
}

