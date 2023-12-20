import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchesService } from 'src/app/services/searches.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [],
})
export class UsersComponent implements OnInit, OnDestroy {
  public totalUsers: number = 0;
  public users: User[] = [];
  public usersTemp: User[] = [];
  public imgSubs: Subscription;
  public from: number = 0;
  public loading: boolean = true;

  constructor(
    private userService: UserService,
    private searchesService: SearchesService,
    private modalImageService: ModalImageService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.modalImageService.newImage
      .pipe(delay(500))
      .subscribe(() => this.loadUsers());
  }

  loadUsers() {
    this.loading = true;
    this.userService.loadUsers(this.from).subscribe({
      next: ({ total, users }) => {
        this.totalUsers = total;
        this.users = users;
        this.usersTemp = users;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => console.log('loadUsers complete'),
    });
  }

  chagePage(value: number) {
    this.from += value;

    if (this.from < 0) {
      this.from = 0;
    } else if (this.from >= this.totalUsers) {
      this.from -= value;
    }

    this.loadUsers();
  }

  search(term: string) {
    if (term.length === 0) {
      return (this.users = this.usersTemp);
    }
    this.searchesService.search('users', term).subscribe({
      next: (results) => {
        this.users = results;
      },
      error: (error) => console.log(error),
      complete: () => console.log('search complete'),
    });
  }

  deleteUser(user: User) {
    if (user.uid === this.userService.uid) {
      return Swal.fire('Error', 'You cannot delete yourself', 'error');
    }
    Swal.fire({
      title: 'Are you sure?',
      text: `You are going to delete ${user.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user).subscribe({
          next: (resp) => {
            Swal.fire(
              'User deleted',
              `${user.name} was successfully deleted`,
              'success'
            ),
              this.loadUsers();
          },
          error: (error) => console.log(error),
          complete: () => console.log('deleteUser completed'),
        });
      }
    });
  }

  changeRole(user: User) {
    this.userService.saveUser(user).subscribe({
      next: (resp) => console.log(resp),
      error: (error) => console.log(error),
      complete: () => console.log('changeRole completed'),
    });
  }

  openModal(user: User) {
    this.modalImageService.openModal('users', user.uid, user.img);
  }
}
