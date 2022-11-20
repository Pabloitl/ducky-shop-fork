import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart.model';
import { CartsService } from 'src/app/services/carts.service';
import { Order } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { Card } from 'src/app/models/card.model';
import { CardsService } from 'src/app/services/cards.service';
import { Payment } from 'src/app/models/payment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy-detail',
  templateUrl: './buy-detail.component.html',
  styleUrls: ['./buy-detail.component.scss']
})
export class BuyDetailComponent implements OnInit {
  user!: User;
  user_id!: number;
  cards: Card[] = [];
  products: Cart[] = [];
  total: number = 0;
  order: Order = {
    id: 0,
    order_number: 2,
    cart_id: 0,
    user_id: 2
  }
  order_number: number = 0

  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
    private cartsService: CartsService,
    private cardsService: CardsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUser()
  }

  getUser() {
    this.usersService.getUserLogged()
      .subscribe(data => {
        this.user = data
        this.user_id = this.user.id
        this.order.user_id = this.user_id
        this.usersService.getUser(this.user.id)
          .subscribe(data => {
            this.user = data
            console.log(this.user)
          })
        this.getCard()
        this.getCartUser()
      })
  }

  getCard() {
    this.cardsService.getCard(this.user_id)
      .subscribe(data => {
        this.cards = data.data
        console.log(this.cards[0])
      })
  }

  getCartUser() {
    this.cartsService.getUserCart(this.user_id)
      .subscribe(data => {
        this.products = data.data
        this.totalBuy()
      })
  }

  totalBuy() {
    this.products.forEach(product => {
      this.total = this.total + product.amount
    });
  }

  createOrder() {
    var order_number: number = Date.now()
    this.order.order_number = order_number
    this.order.user_id = this.user.id
    var ord!: Order[];
    this.products.forEach(cart => {
      //El número de orden debe ser el mismo para los carritos
      this.order.cart_id = cart.id

      var aux: Order = this.order
      ord.push(aux)

      this.ordersService.createOrder(this.order).subscribe(() => { })
    });

    var pay: Payment = {
      order_number: order_number,
      card_id: this.cards[0].id,
      cards: this.cards[0].id,
      amount: this.total
    }

    localStorage.setItem("order", JSON.stringify(ord))

    this.router.navigate(['/order-detail'], { queryParams: { order: order_number } })
  }
}
