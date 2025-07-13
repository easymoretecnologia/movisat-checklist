import Body from "./body";
import Column from "./column";
import Container from "./container";
import Error from "./error";
import Head from "./head";
import Loading from "./loading";
import NoAccess from "./noaccess";
import NoData from "./nodata";
import Options, { Item } from "./options";
import Paginate from "./paginate";
import Text from "./text";
import Title from "./title";

export default {
    Column,
    Container,
    Error,
    Head,
    Body,
    Loading,
    NoAccess,
    NoData,
    Options: {
        Container: Options,
        Item,
    },
    Pagination: Paginate,
    Text,
    Title,
}
