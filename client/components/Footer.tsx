import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Footer() {
  return (
    <footer className="flex items-center justify-center p-4 bg-gray-800 text-white">
    <h2 className="flex items-center text-lg">
        Made With {<FavoriteIcon className="text-red-500 ml-1" />}
    </h2>
    </footer>
  )
}
