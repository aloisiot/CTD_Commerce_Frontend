import "./style.scss"
import { Container, Card, Col, Row, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import restClient from '../../services/restClient';
import { useCallback, useState, useEffect, useContext} from "react"
import Swal from "sweetalert2"; 
import SecTittle from "../../components/Tipografy/SecTittle";
import { CartContext } from "../../context/CartContest";

export default function ProductDetails() {

    const navigate = useNavigate();
    const { productId } = useParams()
    const [product, setProduct] = useState({});
    const { addProduct, productsInCart } = useContext(CartContext);
    let cartIncludes;

    productsInCart.forEach( p => {
        cartIncludes = p.id === product.id;
    });

    const getProduct = useCallback( async () => {
        const response = await restClient.get(`/products/${productId}`)
        const product = response.data;
        setProduct(product);
    }, [setProduct, productId]);

    useEffect(() => {
        try{
            getProduct();
        } catch {
            Swal.fire({
                title: "Ops! ocorreu um erro.",
                text: "Parece que a conexão com o servidor falhou.",
                icon: "error"
            })
        }
    }, [getProduct ])

    return (
        <Container id="product-datails-content">
            <Row xs={1} sm={2} className="d-flex flex-wrap">
                <Col>
                    <img src={product.imageUrl} alt={`${product.title}`}></img>
                </Col>
                <Col className="d-flex flex-column justify-content-center">
                    <SecTittle> {product.title} </SecTittle>
                    <Card.Text>
                        <span>{product.description}</span>
                        <br />
                        <span className="price">{`R$ ${product.price}`}</span>
                    </Card.Text>
                    {cartIncludes ? (
                        <Button className="finalize" variant="primary" onClick={() => navigate('/cart')}>
                            Finalizar Pedido
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={() => addProduct(product)}>
                            Adicionar ao carrinho
                        </Button>
                    )}
                </Col>
            </Row>
        </Container>
    )
}