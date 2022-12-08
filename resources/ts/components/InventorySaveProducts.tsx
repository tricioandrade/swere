import React, {FormEvent, useEffect, useState} from "react";
import {Button, ButtonGroup, Card, Col, Form, FormControl, FormLabel, FormSelect, Row} from "react-bootstrap";
import CalculatorTrait from "../tasks/CalculatorTrait";
import {Tax} from "../interfaces/TaxTypes";
import MessageBox from "../tasks/MessageBox";
import ProductsRequests from "../requests/ProductsRequests";
import {nanoid} from "nanoid";
import Preloader from "../tasks/Preloader";
import axios from "../api/axios";
import {Product} from "../interfaces/Product";

export const  InventorySaveProducts = () => {

    const [page, setPage] = useState(true);
    const [taxValue, setTaxValue] = useState(0);
    const [taxAdded, setTaxAdded] = useState(0);
    const [priceWithTax, setPriceWithTax] = useState(0);
    const [price, setPrice] = useState(0);


    const [products, setProducts] =  useState<Product[]>([]);


    useEffect( () => {
        const { priceWithTax, taxAdded } = CalculatorTrait.calculatePriceTax({
            price: price,
            taxValue: taxValue,
            discount: 0
        });
        setPriceWithTax(priceWithTax);
        setTaxAdded(taxAdded);

        (async () => {
            if (!page) {
                Preloader.active();
                const { data } = await axios.get('/product');
                console.log(data);
                setProducts(data.data);
                Preloader.inactive();
            }
        })();
    }, [price,  taxValue, page]);


    const listOfProducts = (products: Product[]) => {
        console.log(products);
        if (!products.length) return ;
        return products.map((item: Product, key: number) => {
             return <option key={key} value={item.attributes.code}>{item.attributes.name}</option>;
        });
    }


    const handleSubmit = (evt: FormEvent) => {
        evt.preventDefault()
        const elem = evt.target as HTMLFormElement;
        const form = new FormData();

        const taxId: number = +elem.tax_id;

        const uniqueId: string = elem.code.value.length ? elem.code.value : nanoid(12);
        console.log(uniqueId);

        form.append('name', elem.productName.value );
        form.append('description', elem.description.value );
        form.append('code', uniqueId);
        form.append('product_type', elem.product_type.value );
        form.append('price', elem.price.value );
        form.append('price_with_tax', elem.price_with_tax.value );
        form.append('stock_quantity', elem.stock_quantity.value );
        form.append('unity_quantity', elem.unity_quantity.value );
        // form.append('for_sale_quantity', elem.for_sale_quantity.value );
        form.append('for_sale_status', elem.for_sale_status.value );
        form.append('unity_of_measure', elem.unity_of_measure.value );
        // form.append('storage_id', elem.storage_id.value );
        form.append('tax_value', elem.tax_value.value );
        form.append('tax_total_added', elem.tax_total_added.value );
        form.append('tax_id', elem.tax_id.value );

        if (taxId === Tax.ISE){
            form.append('tax_exemption_code', elem.tax_exemption_code.value );
            form.append('tax_exemption_reason', elem.tax_exemption_reason.value );
        }

        if (taxId === Tax.ISE && (elem.tax_value !== 0 || elem.tax_exemption_reason.length < 6)) {
            MessageBox.open('O valor do imposto tem de ser 0');
            return;
        }

        if ((taxId === Tax.IVA || taxId === Tax.IS || taxId === Tax.OUT || taxId === Tax.NS ) && +elem.tax_value <= 0) {
            MessageBox.open('O valor do imposto tem de ser maior que 0');
            return;
        }

        if(page) {
            Preloader.active();
            ProductsRequests.saveProduct(form).then((data) => {
                Preloader.inactive();
                MessageBox.open('O produto foi cadastrado');
                console.log(data);
            }).catch( (err) => {
                Preloader.inactive();
                MessageBox.open('Não foi possível salvar o produto');
                console.log(err);
            });
        }else {
            Preloader.active();
            ProductsRequests.updateProduct(+elem.product_id.value, form).then( () => {
                Preloader.inactive();
                MessageBox.open('O produto foi atualizado');
            }).catch( () => {
                Preloader.inactive();
                MessageBox.open('Não foi possívem atualizar o produto');
            });
        }
    }


    return (
        <>
            <Row className='col-12'>
                <ButtonGroup size="sm">
                    <Button className={ page ? 'active' : ''} onClick={ () => setPage(true) } >Cadastrar produto</Button>
                    <Button className={ !page ? 'active' : ''} onClick={ () => setPage(false ) } >Actualizar dados de produto</Button>
                </ButtonGroup>
            </Row>
            <Row lg={12} className="d-flex align-items-stretch" id="listedSearchProduct"></Row>
            <Row className="mt-3">
                <Card className='shadow rounded col-12 m-auto'>
                    <Form id={page ? 'FormAddProduct' : 'FormUpdateProduct'} className="animation" onSubmit={
                        (evt) => handleSubmit(evt)
                    }>
                        <Card.Body className='row'>
                            <div className="col-12 text-center">
                                {page ?
                                    <strong>Cadastrar dados de Produtos</strong>
                                    :''}
                                {!page ?
                                    <strong>Actualizar dados de Produtos</strong>
                                    : ''}
                            </div>

                            <Row className="col-4">
                                <Col lg={12}><pre className="text-center"><i>Descrição do artigo</i></pre></Col>
                                {!page ?
                                    <Col>
                                        <FormLabel className="text-center" htmlFor="product_id">Selecione o produto ou
                                            serviço</FormLabel>
                                        <FormSelect id="listOfProducts">
                                            { listOfProducts(products) }
                                        </FormSelect>
                                    </Col>
                                    :''}
                                <Col lg={12}>
                                    <FormLabel htmlFor="productName">Nome do produto</FormLabel>
                                    <FormControl id="productName" required/>
                                </Col>
                                <Col lg={6}>
                                    <FormLabel htmlFor="description">Descrição</FormLabel>
                                    <FormControl id="description"/>
                                </Col>
                                {page ?
                                    <Col lg={6}>
                                        <FormLabel htmlFor="code">Código</FormLabel>
                                        <FormControl id="code"/>
                                    </Col>
                                    : ''}
                                {page ?
                                    <Col lg={6}>
                                        <FormLabel htmlFor="product_type">Tipo de Artigo</FormLabel>
                                        <FormSelect id="product_type">
                                            <option value="P">Produto</option>
                                            <option value="S">Serviço</option>
                                        </FormSelect>
                                    </Col>
                                    : ''}
                                <Col lg={6}>
                                    <FormLabel htmlFor="for_sale_status">Pronto para venda</FormLabel>
                                    <FormSelect id="for_sale_status">
                                        <option value="yes">Sim</option>
                                        <option value="no">Não</option>
                                    </FormSelect>
                                </Col>
                            </Row>

                            {/*Quotation*/}

                            <Row className="col-4">
                                <Col lg={12}><pre className="text-center"><i>Cotação</i></pre></Col>
                                <Col lg={page ? 6 : 12}>
                                    <FormLabel htmlFor="price">Preço</FormLabel>
                                    <FormControl type="number" id="price" onChange={
                                        (evt) => setPrice(+evt.target.value)
                                    } required/>
                                </Col>
                                <Col lg={6}>
                                    <FormLabel htmlFor="price_with_tax">Preço com imposto</FormLabel>
                                    <FormControl type="number" value={ priceWithTax } id="price_with_tax" disabled/>
                                </Col>
                                <Col lg={6}>
                                    <label htmlFor="stock_quantity">Quantidade</label>
                                    <FormControl type="number" id="stock_quantity" required/>
                                </Col>
                                <Col lg={page ? 6 : 12}>
                                    <FormLabel htmlFor="unity_quantity">Unidade</FormLabel>
                                    <FormControl type="number" id="unity_quantity" required/>
                                </Col>
                                {page ?
                                    <Col lg={12}>
                                        <FormLabel htmlFor="unity_of_measure">Pagamento por: </FormLabel>
                                        <FormSelect id="unity_of_measure">
                                            <option value="KG">Por kilograma, Kilo</option>
                                            <option value="UN">Por unidade, Unitário</option>
                                            <option value="HH">Por hora</option>
                                        </FormSelect>
                                    </Col>
                                    :''}
                            </Row>

                            {/*Tax*/}
                            <Row className="col-4">
                                <Col lg={12}><pre className="text-center"><i>Imposto</i></pre></Col>
                                <div className="col-6">
                                    <FormLabel htmlFor="tax_value">Valor do imposto</FormLabel>
                                    <FormControl type="number" className="form-control" id="tax_value" onChange={
                                        (evt) => setTaxValue(+evt.target.value)
                                    } required/>
                                </div>
                                <Col lg={6}>
                                    <FormLabel htmlFor="tax_total_added">Taxa adicionada</FormLabel>
                                    <FormControl value={taxAdded} className="form-control" id="tax_total_added" disabled/>
                                </Col>
                                {taxValue === 0 || taxValue.toString().length === 0 ?
                                    <>
                                        <Col lg={6}>
                                            <FormLabel htmlFor="tax_exemption_code">Código de isenção</FormLabel>
                                            <FormControl id="tax_exemption_code"/>
                                        </Col>
                                        <Col lg={6}>
                                            <FormLabel htmlFor="tax_exemption_reason">Motivo de isenção</FormLabel>
                                            <FormControl id="tax_exemption_reason"/>
                                        </Col>
                                    </>
                                    :
                                    <Col lg={12}>
                                        <p>Para produtos/serviços isentos de imposto, deverá informar o motivo de isensão!</p>
                                    </Col>
                                }
                                <Col lg={12}>
                                    <FormLabel htmlFor="tax_id">Tipo de imposto</FormLabel>
                                    <FormSelect id="tax_id">
                                        {taxValue === 0 || taxValue.toString().length === 0 ?
                                            <option value={ Tax.ISE }>ISE - Isento sob termos</option>
                                            :   <>
                                                <option value={ Tax.IVA } >IVA - Imposto sob valor acrescentado</option>
                                                <option value={ Tax.IS  } >IS - Imposto de Selo</option>
                                                <option value={ Tax.NS  } >NS - Não sujeição</option>
                                                <option value={ Tax.OUT }  >OUT - Outros</option>
                                            </>
                                        }
                                    </FormSelect>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className='text-end'>
                            <Button type="submit" className="btn-primary mt-2 ">
                                {page ?
                                    <><i className='fa fa-save'/> Salvar</>
                                    :
                                    <><i className='fa fa-upload'/> Actualizar</>
                                }
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </Row>
        </>
    );
}
