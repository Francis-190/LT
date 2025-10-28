namespace LT.billingSecurity.srv;
using { LT.billingSecurity as db } from '../db/schema';

service MyService {

    entity Foo as projection on db.employee;

}
