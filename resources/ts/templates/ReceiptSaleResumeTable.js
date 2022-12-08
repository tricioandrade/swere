import axios from "../api/axios";
import MessageBox from "../components/MessageBox";
import Preloader from "../tasks/Preloader";


function ReceiptSaleResumeTable  (){

    return `
                    <div class="card-img">
                    </div>
                    <div class="row card-body text-left" style="height:30vh; overflow: auto">
                        <h4>Resumo de vendas</h4>
                        <hr>

                       <table id="receiptSaleResume" class="table">
                           <thead>
                                <tr>
                                    <th>&numero;</th>
                                    <th>Número da Factura</th>
                                    <th>Tipo de Factura</th>
                                    <th>Usuário</th>
                                    <th>Data</th>
                                    <th>Total</th>
                                </tr>
                           </thead>
                           <tbody>
                           </tbody>
                       </table>
                    </div>
                    <div class="card-footer flex flex-column d-inline">
<!--                        <h2 class="">-->
<!--                            Total: </h2>-->
<!--                            <form>-->
<!--                            <input style="font-size: 2em"-->
<!--                            type="number" id="totalSaleResume" class="form-control border-0 p-0 bg-transparent" disabled value="0.00"></form>-->
                    </div>

    `;
}

export default  ReceiptSaleResumeTable;
