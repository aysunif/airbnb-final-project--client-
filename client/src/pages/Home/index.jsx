import Listing from "../../components/Listing"
import { Helmet} from 'react-helmet-async';
const Home = () => {
  return (
    <>
     <Helmet>
        <title>Airbnb | Vacation rentals, cabins, beach hauses, & more</title>
        <meta name="description" content="home page" />
      </Helmet>
     <Listing />
    </>
  )
}

export default Home