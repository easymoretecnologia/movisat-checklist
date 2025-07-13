import { SweetAlertCustomClass } from 'sweetalert2'
import { ReactSweetAlertOptions } from 'sweetalert2-react-content'

export type SweetAlertOptions = Omit<ReactSweetAlertOptions, 'customClass'> & {
    customClass?: SweetAlertCustomClass
}
