'use client'

import _ from 'lodash'
import CustomDialog, { defaultDialogSx, useDialog } from "@/components/dialog/CustomDialog"
import Inputs from "@/components/inputs"
import PageHeader from "@/components/PageHeader"
import Tables from "@/components/tables"
import { palette } from "@/configs/themeConfig"
import { Empresa } from "@/entities/empresa.entity"
import { User as Usuario } from "@/entities/user.entity"
import useForm from "@/hooks/useForm"
import useClass from "@/hooks/useState"
import { FilterProps } from "@/types/filter"
import { Paginate } from "@/types/paginate"
import axios from "@/utils/axios"
import { onPage } from "@/utils/set-page"
import sweetalert, { toast } from "@/utils/sweetalert"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Button, Card, CardActions, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, IconButton, InputAdornment, ListItemText, MenuItem, TableRow, Tooltip, Typography } from "@mui/material"
import { Session } from "next-auth"
import React from "react"
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { Veiculo } from '@/entities/veiculo.entity'
import { DateTime } from 'luxon'

interface Props {
    session: Session
    empresas: Empresa[]
}

type VeiculosFilter = FilterProps<{ by: 'id' | 'nome' | 'email' | 'cpf' | 'telefone' }>

export default ({ session, empresas }: Props) => {
    const [filters, setFilters] = React.useState<VeiculosFilter>({ by: 'id', direction: 'asc', page: 1, limit: 10, search: '' })
    const veiculos = useClass<Paginate<Veiculo>>({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'loading')
    const [store, setStore] = React.useState<Veiculo>({ id: 0, id_empresa: 0, cor: '', modelo: '', placa: '', apelido: '' } as Veiculo)
    const [edit, setEdit] = React.useState(false)

    const { onChange } = useForm({})
    const { openDialog, closeDialog, ...customDialog } = useDialog()

    const get = React.useCallback(_.debounce(() => {
        veiculos.set({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'loading')
        
        axios.get({ raw: true, url: '/api/data/veiculos/list', data: filters, token: session.accessToken, process: true, message: false })
        .then(res => {
            veiculos.set(res.data, 'ready')
        })
        .catch(err => {
            veiculos.set({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'error')
        })
    }, 500), [session, filters])

    React.useEffect(() => {
        get()
    }, [filters])

    const onClose = () => {
        setEdit(false)
        _.delay(() => setStore({ id: 0, id_empresa: 0, cor: '', modelo: '', placa: '', apelido: '' } as Veiculo), 1000)
    }

    const onStore = (veiculo?: Veiculo) => () => {
        setStore(veiculo ?? { id: 0, id_empresa: 0, cor: '', modelo: '', placa: '', apelido: '' } as Veiculo)
        setEdit(true)
    }

    const onDelete = (veiculo: Veiculo) => () => {
        openDialog({
            open: true,
            title: 'Confirmar ação',
            content: (
                <React.Fragment>
                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                        Confirmar a exclusão do veículo:
                    </Typography>
                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                        {veiculo.apelido}
                    </Typography>
                </React.Fragment>
            ),
            onClose: () => closeDialog(),
            onAction: () => {
                sweetalert.loading()

                axios.delete({ raw: true, url: '/api/data/veiculos', data: { id: veiculo.id }, token: session.accessToken, process: true, message: true })
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

        axios.raw({ raw: true, method: store.id ? 'PUT' : 'POST', url: '/api/data/veiculos', data: store, token: session.accessToken, process: true, message: true })
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
                    Veículos
                </Typography>
            )} />
            
            <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={6} justifyContent='space-between' alignItems='center'>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                        <Inputs.TextField label='Buscar por placa, apelido, cor, modelo' name='search' value={filters.search} onChange={onChange(setFilters)} size='small' />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 2 }}>
                        <Button color='primary' onClick={onStore()}>
                            <Icon icon='solar:add-square-linear' fontSize={20} className="!mr-2" />
                            Adicionar veículo
                        </Button>
                    </Grid2>
                </Grid2>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
                <Card>
                    <Tables.Container>
                        <Tables.Head>
                            <Tables.Title title='#' name='id' filters={filters} setFilters={setFilters} />
                            <Tables.Title title='Empresa' name='empresa' />
                            <Tables.Title title='Cor' name='cor' filters={filters} setFilters={setFilters} />
                            <Tables.Title title='Modelo' name='modelo' filters={filters} setFilters={setFilters} />
                            <Tables.Title title='Placa' name='placa' filters={filters} setFilters={setFilters} />
                            <Tables.Title title='Apelido' name='apelido' filters={filters} setFilters={setFilters} />
                            <Tables.Title title='Último Checklist' name='ultimo_checklist' filters={filters} setFilters={setFilters} />
                            <Tables.Title title='Ações' width={150} />
                        </Tables.Head>

                        <Tables.Body>
                        {veiculos.status === 'loading' && (<Tables.Loading colSpan={8} />)}

                        {veiculos.status === 'error' && (<Tables.Error colSpan={8} />)}

                        {veiculos.status === 'ready' && veiculos.items.length <= 0 && <Tables.NoData colSpan={8} />}

                        {veiculos.status === 'ready' && veiculos.items.map(veiculo => (
                            <TableRow key={`veiculo-${veiculo.id}`}>
                                <Tables.Text typographyProps={{ sx: { fontWeight: 600 } }}>{veiculo.id}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{empresas.find(empresa => empresa.id === veiculo.id_empresa)?.nome_fantasia}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{veiculo.cor}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{veiculo.modelo}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{veiculo.placa}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{veiculo.apelido}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{veiculo.ultimo_checklist ? veiculo.ultimo_checklist : '-'}</Tables.Text>
                                <Tables.Column>
                                    <Tooltip placement='top' title={(<Typography sx={{ color: 'black !important' }}>Editar</Typography>)}>
                                        <IconButton size='small' onClick={onStore(veiculo)}>
                                            <Icon icon='solar:pen-new-square-linear' fontSize={20} />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip placement='top' title={(<Typography sx={{ color: 'black !important' }}>Deletar</Typography>)}>
                                        <IconButton size='small' onClick={onDelete(veiculo)}>
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
                        <Tables.Pagination color="primary" size='medium' total={veiculos.last} page={veiculos.current} onChange={(e, page) => onPage(e, page, setFilters)}  />
                    </CardActions>
                </Card>
            </Grid2>
        </Grid2>

        <Dialog fullWidth maxWidth='sm' sx={{ ...defaultDialogSx }} open={edit} onClose={onClose}>
            <DialogTitle>
                <Typography sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '1.5rem', color: theme => theme.palette.primary.main }}>
                    {store.id ? 'Editar' : 'Cadastrar'} Veículo
                </Typography>
            </DialogTitle>

            <form onSubmit={onSave} noValidate autoComplete="off">
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <Grid2 container spacing={6}>
                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.Select 
                                    label='Empresa'
                                    name='id_empresa'
                                    value={store.id_empresa}
                                    multiple={false}
                                    options={empresas}
                                    withSearch
                                    filter={(option: Empresa) => `${option.cnpj} ${option.nome_fantasia}`}
                                    optionComponent={(option: Empresa) => (
                                        <MenuItem key={`select-empresa-${option.id}`} value={Number(`${option.id}`)}>
                                            <ListItemText primary={`${option.nome_fantasia}`} secondary={`${option.cnpj}`} />
                                        </MenuItem>
                                    )}
                                    render={(selected: number) => empresas.find(i => Number(i.id) === Number(`${selected}`))?.nome_fantasia ?? ''}
                                    onChange={(e) => setStore(prev => ({ ...prev, id_empresa: Number(`${e.target.value}`) }))}
                                    labelProps={{ sx: { '&.MuiFormLabel-filled': {fontWeight: 700} } }}
                                    size='small'
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField label='Apelido' name='apelido' value={store.apelido} onChange={onChange(setStore)} size='small' />
                            </Grid2>
                            
                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField  label="Modelo" name="modelo" value={store.modelo} onChange={onChange(setStore)} size='small' />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField label='Cor' name='cor' value={store.cor} onChange={onChange(setStore)} size='small' />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField 
                                    label='Placa' 
                                    name='placa' 
                                    value={store.placa} 
                                    onChange={onChange(setStore)} 
                                    size='small'
                                    placeholder='AAA-0000 ou AAA-0A00'
                                    slotProps={{
                                        input: {
                                            inputComponent: Inputs.TextMask as any,
                                            inputProps: {
                                                mask: ['aaa-0000', 'aaa-0a00'],
                                                onChange: onChange(setStore)
                                            },
                                        }
                                    }} 
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