'use client'

import _ from 'lodash'
import CustomDialog, { defaultDialogSx, useDialog } from "@/components/dialog/CustomDialog"
import Inputs from "@/components/inputs"
import PageHeader from "@/components/PageHeader"
import Tables from "@/components/tables"
import { palette } from "@/configs/themeConfig"
import { Empresa } from "@/entities/empresa.entity"
import useForm from "@/hooks/useForm"
import useClass from "@/hooks/useState"
import { FilterProps } from "@/types/filter"
import { Paginate } from "@/types/paginate"
import axios from "@/utils/axios"
import { onPage } from "@/utils/set-page"
import sweetalert, { toast } from "@/utils/sweetalert"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Button, Card, CardActions, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, IconButton, TableRow, Tooltip, Typography } from "@mui/material"
import { Session } from "next-auth"
import React from "react"
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'

interface Props {
    session: Session
}

type EmpresasFilter = FilterProps<{ by: 'id' | 'nome_fantasia' | 'email' | 'cnpj' | 'contato_responsavel' }>

export default ({ session }: Props) => {
    const [filters, setFilters] = React.useState<EmpresasFilter>({ by: 'id', direction: 'asc', page: 1, limit: 10, search: '' })
    const empresas = useClass<Paginate<Empresa>>({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'loading')
    const [store, setStore] = React.useState<Empresa>({ id: 0, nome_fantasia: '', email: '', cnpj: '', contato_responsavel: '' } as Empresa)
    const [edit, setEdit] = React.useState(false)

    const { onChange } = useForm({})
    const { openDialog, closeDialog, ...customDialog } = useDialog()

    const get = React.useCallback(_.debounce(() => {
        empresas.set({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'loading')
        
        axios.get({ raw: true, url: '/api/data/empresas/list', data: filters, token: session.accessToken, process: true, message: false })
        .then(res => {
            empresas.set(res.data, 'ready')
        })
        .catch(err => {
            empresas.set({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'error')
        })
    }, 500), [session, filters])

    React.useEffect(() => {
        get()
    }, [filters])

    const onClose = () => {
        setEdit(false)
        _.delay(() => setStore({ id: 0, nome_fantasia: '', email: '', cnpj: '', contato_responsavel: '' } as Empresa), 1000)
    }

    const onStore = (empresa?: Empresa) => () => {
        setStore(empresa ?? { id: 0, nome_fantasia: '', email: '', cnpj: '', contato_responsavel: '' } as Empresa)
        setEdit(true)
    }

    const onDelete = (empresa: Empresa) => () => {
        openDialog({
            open: true,
            title: 'Confirmar ação',
            content: (
                <React.Fragment>
                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                        Confirmar a exclusão da empresa:
                    </Typography>
                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                        {empresa.nome_fantasia}
                    </Typography>
                </React.Fragment>
            ),
            onClose: () => closeDialog(),
            onAction: () => {
                sweetalert.loading()

                axios.delete({ raw: true, url: '/api/data/empresas', data: { id: empresa.id }, token: session.accessToken, process: true, message: true })
                .then(res => {
                    closeDialog()
                    sweetalert.close()
                    toast.success({ html: <Typography>{res.data.message}</Typography> })
                    get()
                })
                .catch(err => {})
            },
            actionTitle: 'Confirmar',
            actionColor: 'error',
            cancelTitle: 'Cancelar',
            cancelColor: 'primary',
        })
    }

    const onSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        sweetalert.loading()

        axios.raw({ raw: true, method: store.id ? 'PUT' : 'POST', url: '/api/data/empresas', data: store, token: session.accessToken, process: true, message: true })
        .then(res => {
            onClose()
            sweetalert.close()
            toast.success({ html: <Typography>{res.data.message}</Typography> })
            get()
        })
        .catch(err => {})
    }

    return <React.Fragment>
        <Grid2 container spacing={6}>
            <PageHeader title={(
                <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '2rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                    Empresas
                </Typography>
            )} />
            
            <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={6} justifyContent='space-between' alignItems='center'>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                        <Inputs.TextField label='Buscar por nome, email, cnpj' name='search' value={filters.search} onChange={onChange(setFilters)} size='small' />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 2 }}>
                        <Button color='primary' onClick={onStore()}>
                            <Icon icon='solar:add-square-linear' fontSize={20} className="!mr-2" />
                            Adicionar empresa
                        </Button>
                    </Grid2>
                </Grid2>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
                <Card>
                    <Tables.Container>
                        <Tables.Head>
                            <Tables.Title title='#' name='id' filters={filters} setFilters={setFilters} />
                            <Tables.Title title='CNPJ' name='cnpj' filters={filters} setFilters={setFilters}  />
                            <Tables.Title title='Nome' name='nome_fantasia' filters={filters} setFilters={setFilters} />
                            <Tables.Title title='Email' name='email' filters={filters} setFilters={setFilters}  />
                            <Tables.Title title='Contato' name='contato_responsavel' filters={filters} setFilters={setFilters}  />
                            <Tables.Title title='Ações' width={150} />
                        </Tables.Head>

                        <Tables.Body>
                        {empresas.status === 'loading' && (<Tables.Loading colSpan={6} />)}

                        {empresas.status === 'error' && (<Tables.Error colSpan={6} />)}

                        {empresas.status === 'ready' && empresas.items.length <= 0 && <Tables.NoData colSpan={6} />}

                        {empresas.status === 'ready' && empresas.items.map(empresa => (
                            <TableRow key={`empresa-${empresa.id}`}>
                                <Tables.Text typographyProps={{ sx: { fontWeight: 600 } }}>{empresa.id}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{empresa.cnpj}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{empresa.nome_fantasia}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{empresa.email}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{empresa.contato_responsavel}</Tables.Text>
                                <Tables.Column>
                                    <Tooltip placement='top' title={(<Typography sx={{ color: 'black !important' }}>Editar</Typography>)}>
                                        <IconButton size='small' onClick={onStore(empresa)}>
                                            <Icon icon='solar:pen-new-square-linear' fontSize={20} />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip placement='top' title={(<Typography sx={{ color: 'black !important' }}>Deletar</Typography>)}>
                                        <IconButton size='small' onClick={onDelete(empresa)}>
                                            <Icon icon='solar:trash-bin-minimalistic-2-linear' fontSize={20} />
                                        </IconButton>
                                    </Tooltip>
                                </Tables.Column>
                            </TableRow>
                        ))}
                        </Tables.Body>
                    </Tables.Container>
                </Card>

                <Card sx={{ marginTop: 4 }}>
                    <CardActions sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: '0.75rem !important' }}>
                        <Tables.Pagination color="primary" size='medium' total={empresas.last} page={empresas.current} onChange={(e, page) => onPage(e, page, setFilters)}  />
                    </CardActions>
                </Card>
            </Grid2>
        </Grid2>

        <Dialog fullWidth maxWidth='sm' sx={{ ...defaultDialogSx }} open={edit} onClose={onClose}>
            <DialogTitle>
                <Typography sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '1.5rem', color: theme => theme.palette.primary.main }}>
                    {store.id ? 'Editar' : 'Cadastrar'} Empresa
                </Typography>
            </DialogTitle>

            <form onSubmit={onSave} noValidate autoComplete="off">
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <Grid2 container spacing={6}>
                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField 
                                    label='CNPJ' 
                                    name='cnpj' 
                                    value={store.cnpj} 
                                    onChange={onChange(setStore)} 
                                    placeholder='00.000.000/0000-00'
                                    slotProps={{
                                        input: {
                                            inputComponent: Inputs.TextMask as any,
                                            inputProps: {
                                                mask: "00.000.000/0000-00",
                                                onChange: onChange(setStore)
                                            },
                                        }
                                    }} />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField label='Nome Fantasia' name='nome_fantasia' value={store.nome_fantasia} onChange={onChange(setStore)} />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField 
                                    label="Email"
                                    name="email"
                                    value={store.email}
                                    onChange={onChange(setStore)}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField 
                                    label='Contato Responsável' 
                                    name='contato_responsavel' 
                                    value={store.contato_responsavel} 
                                    onChange={onChange(setStore)} 
                                />
                            </Grid2>
                        </Grid2>
                    </LocalizationProvider>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color='error'>Fechar</Button>
                    <Button type='submit' color='primary'>Salvar</Button>
                </DialogActions>
            </form>
        </Dialog>

        <CustomDialog {...customDialog} />
    </React.Fragment>
}