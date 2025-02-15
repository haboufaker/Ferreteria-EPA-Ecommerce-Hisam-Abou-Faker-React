import { Box, Button, IconButton, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Item from "../../components/Item";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../../theme";
import { addToCart } from "../../state";
import { useDispatch } from "react-redux";
import { getFirestore, doc, getDoc, getDocs, collection} from "firebase/firestore";

const ItemDetailContainer = () => {
    const dispatch = useDispatch();
    const { itemId } = useParams();
    const [value, setValue] = useState("description");
    const [count, setCount] = useState(1);
    const [item, setItem] = useState(null);
    const [items, setItems] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getProduct = () => {
        const db = getFirestore();
        const querySnapshot = doc(db, "Item", itemId);
    
        getDoc(querySnapshot).then((querySnapshot) => {
            if (querySnapshot.exists()) {
                setItem({id: parseInt(querySnapshot.id), attributes: querySnapshot.data()});
            }
            console.log({id: parseInt(querySnapshot.id), attributes: querySnapshot.data()});
        })
      }

    const getProducts = () => {
        const db = getFirestore();
        const querySnapshot = collection(db, "Item");
    
        getDocs(querySnapshot).then((response) => {
          const data = response.docs.map((item)=> {
            return {id: parseInt(item.id), attributes: item.data()};
          });
            setItems(data);
        }).catch(error => console.log(error))
      }

    useEffect(() => {
        getProduct();
        getProducts();
    }, [itemId]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box width="80%" m="80px auto">
            <Box display="flex" flexWrap="wrap" columnGap="40px">
                {/* IMAGES */}
                <Box flex="1 1 40%" mb="40px">
                    <img
                        alt={item?.name}
                        width="100%"
                        height="100%"
                        src={item?.attributes?.imageurl}
                        style={{ objectFit: "contain" }}
                    />
                </Box>

                {/* ACTIONS */}
                <Box flex="1 1 50%" mb="40px">
                    <Box display="flex" justifyContent="space-between">
                        <Box>Home/Item</Box>
                        <Box>Anterior Siguiente</Box>
                    </Box>

                    <Box m="65px 0 25px 0">
                        <Typography variant="h3">{item?.attributes?.name}</Typography>
                        <Typography>${item?.attributes?.price}</Typography>
                        <Typography sx={{ mt: "20px" }}>
                            {item?.attributes?.longDescription}
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" minHeight="50px">
                        <Box
                            display="flex"
                            alignItems="center"
                            border={`1.5px solid ${shades.neutral[300]}`}
                            mr="20px"
                            p="2px 5px"
                        >
                            <IconButton onClick={() => setCount(Math.max(count - 1, 0))}>
                                <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ p: "0 5px" }}>{count}</Typography>
                            <IconButton onClick={() => setCount(count + 1)}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Button
                            sx={{
                                backgroundColor: "#222222",
                                color: "white",
                                borderRadius: 0,
                                minWidth: "150px",
                                padding: "10px 40px",
                            }}
                            onClick={() => dispatch(addToCart({ item: { ...item, count } }))}
                        >
                            AGREGAR AL CARRITO
                        </Button>
                    </Box>
                    <Box>
                        <Box m="20px 0 5px 0" display="flex">
                            <FavoriteBorderOutlinedIcon />
                            <Typography sx={{ ml: "5px" }}>AÑADIR A LA LISTA DE DESEOS</Typography>
                        </Box>
                        <Typography>CATEGORIAS: {item?.attributes?.category}</Typography>
                    </Box>
                </Box>
            </Box>

            {/* INFORMATION */}
            <Box m="20px 0">
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="DESCRIPCION" value="description" />
                    <Tab label="RESEÑAS" value="reviews" />
                </Tabs>
            </Box>
            <Box display="flex" flexWrap="wrap" gap="15px">
                {value === "description" && (
                <div>{item?.attributes?.longDescription}</div>
                )}
                {value === "reviews" && <div>reseñas</div>}
            </Box>

            {/* RELATED ITEMS */}
            <Box mt="50px" width="100%">
                <Typography variant="h3" fontWeight="bold">
                    Productos relacionados
                </Typography>
                <Box
                    mt="20px"
                    display="flex"
                    flexWrap="wrap"
                    columnGap="1.33%"
                    justifyContent="space-between"
                >
                    {items.slice(0, 4).map((item, i) => (
                        <Item key={`${item.name}-${i}`} item={item} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default ItemDetailContainer;