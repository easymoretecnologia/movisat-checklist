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

interface Props {
    session: Session
    empresas: Empresa[]
}

type UsuariosFilter = FilterProps<{ by: 'id' | 'nome' | 'email' | 'cpf' | 'telefone' }>

const tiposAcesso = [
    { id: 0, nome: 'Administrador' },
    { id: 1, nome: 'Supervisor' },
    { id: 2, nome: 'Motorista' },
]

export default ({ session, empresas }: Props) => {
    const [filters, setFilters] = React.useState<UsuariosFilter>({ by: 'id', direction: 'asc', page: 1, limit: 10, search: '' })
    const usuarios = useClass<Paginate<Usuario>>({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'loading')
    const [store, setStore] = React.useState<Usuario>({ id: 0, nome: '', email: '', cpf: '', telefone: '', tipo_acesso: 2, id_empresa: 0 } as Usuario)
    const [edit, setEdit] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)

    const { onChange } = useForm({})
    const { openDialog, closeDialog, ...customDialog } = useDialog()

    const get = React.useCallback(_.debounce(() => {
        usuarios.set({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'loading')
        
        axios.get({ raw: true, url: '/api/data/usuarios/list', data: filters, token: session.accessToken, process: true, message: false })
        .then(res => {
            usuarios.set(res.data, 'ready')
        })
        .catch(err => {
            usuarios.set({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'error')
        })
    }, 500), [session, filters])

    React.useEffect(() => {
        get()
    }, [filters])

    const onClose = () => {
        setEdit(false)
        _.delay(() => setStore({ id: 0, nome: '', email: '', cpf: '', telefone: '', tipo_acesso: 2, id_empresa: 0 } as Usuario), 1000)
    }

    const onStore = (usuario?: Usuario) => () => {
        setStore(usuario ?? { id: 0, nome: '', email: '', cpf: '', telefone: '', tipo_acesso: 2, id_empresa: 0 } as Usuario)
        setEdit(true)
    }

    const onDelete = (usuario: Usuario) => () => {
        openDialog({
            open: true,
            title: 'Confirmar ação',
            content: (
                <React.Fragment>
                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                        Confirmar a exclusão do usuário:
                    </Typography>
                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                        {usuario.nome}
                    </Typography>
                </React.Fragment>
            ),
            onClose: () => closeDialog(),
            onAction: () => {
                sweetalert.loading()

                axios.delete({ raw: true, url: '/api/data/usuarios', data: { id: usuario.id }, token: session.accessToken, process: true, message: true })
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

        axios.raw({ raw: true, method: store.id ? 'PUT' : 'POST', url: '/api/data/usuarios', data: store, token: session.accessToken, process: true, message: true })
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
                    Usuários
                </Typography>
            )} />
            
            <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={6} justifyContent='space-between' alignItems='center'>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                        <Inputs.TextField label='Buscar por nome, email, cpf, telefone' name='search' value={filters.search} onChange={onChange(setFilters)} size='small' />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 2 }}>
                        <Button color='primary' onClick={onStore()}>
                            <Icon icon='solar:add-square-linear' fontSize={20} className="!mr-2" />
                            Adicionar usuário
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
                            <Tables.Title title='Nome' name='nome' filters={filters} setFilters={setFilters} />
                            <Tables.Title title='Email' name='email' filters={filters} setFilters={setFilters}  />
                            <Tables.Title title='Tipo de Acesso' name='tipo_acesso' />
                            <Tables.Title title='CPF' name='cpf' filters={filters} setFilters={setFilters}  />
                            <Tables.Title title='Telefone' name='telefone' filters={filters} setFilters={setFilters}  />
                            <Tables.Title title='Ações' width={150} />
                        </Tables.Head>

                        <Tables.Body>
                        {usuarios.status === 'loading' && (<Tables.Loading colSpan={8} />)}

                        {usuarios.status === 'error' && (<Tables.Error colSpan={8} />)}

                        {usuarios.status === 'ready' && usuarios.items.length <= 0 && <Tables.NoData colSpan={8} />}

                        {usuarios.status === 'ready' && usuarios.items.map(usuario => (
                            <TableRow key={`usuario-${usuario.id}`}>
                                <Tables.Text typographyProps={{ sx: { fontWeight: 600 } }}>{usuario.id}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>
                                    {usuario.tipo_acesso === 0 ? (
                                        <React.Fragment>
                                            -
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            {empresas.find(empresa => empresa.id === usuario.id_empresa)?.nome_fantasia ?? '-'}
                                        </React.Fragment>
                                    )}
                                </Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{usuario.nome}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{usuario.email}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{usuario.tipo_acesso === 0 ? 'Administrador' : (usuario.tipo_acesso === 1 ? 'Supervisor' : 'Motorista')}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{usuario.cpf}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{usuario.telefone}</Tables.Text>
                                <Tables.Column>
                                    <Tooltip placement='top' title={(<Typography sx={{ color: 'black !important' }}>Editar</Typography>)}>
                                        <IconButton size='small' onClick={onStore(usuario)}>
                                            <Icon icon='solar:pen-new-square-linear' fontSize={20} />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip placement='top' title={(<Typography sx={{ color: 'black !important' }}>Deletar</Typography>)}>
                                        <IconButton size='small' onClick={onDelete(usuario)}>
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
                        <Tables.Pagination color="primary" size='medium' total={usuarios.last} page={usuarios.current} onChange={(e, page) => onPage(e, page, setFilters)}  />
                    </CardActions>
                </Card>
            </Grid2>
        </Grid2>

        <Dialog fullWidth maxWidth='sm' sx={{ ...defaultDialogSx }} open={edit} onClose={onClose}>
            <DialogTitle>
                <Typography sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '1.5rem', color: theme => theme.palette.primary.main }}>
                    {store.id ? 'Editar' : 'Cadastrar'} Usuário
                </Typography>
            </DialogTitle>

            <form onSubmit={onSave} noValidate autoComplete="off">
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <Grid2 container spacing={6}>
                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.Select 
                                    label='Tipo de Acesso'
                                    name='tipo_acesso'
                                    value={store.tipo_acesso}
                                    multiple={false}
                                    options={tiposAcesso}
                                    withSearch
                                    size='small'
                                    filter={(option: typeof tiposAcesso[number]) => `${option.nome}`}
                                    optionComponent={(option: typeof tiposAcesso[number]) => (
                                        <MenuItem key={`select-tipo-acesso-${option.id}`} value={Number(`${option.id}`)}>
                                            <ListItemText primary={`${option.nome}`} />
                                        </MenuItem>
                                    )}
                                    render={(selected: number) => tiposAcesso.find(i => Number(i.id) === Number(`${selected}`))?.nome ?? ''}
                                    onChange={(e) => setStore(prev => ({ ...prev, tipo_acesso: Number(`${e.target.value}`) }))}
                                    labelProps={{ sx: { '&.MuiFormLabel-filled': {fontWeight: 700} } }}
                                />
                            </Grid2>

                            {store.tipo_acesso !== 0 && <Grid2 size={{ xs: 12 }}>
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
                            </Grid2>}
                            
                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField label='Nome' name='nome' value={store.nome} onChange={onChange(setStore)} size='small' />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField 
                                    label="Email"
                                    name="email"
                                    value={store.email}
                                    onChange={onChange(setStore)}
                                    size='small'
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField 
                                    label='CPF' 
                                    name='cpf' 
                                    value={store.cpf} 
                                    onChange={onChange(setStore)} 
                                    size='small'
                                    placeholder='000.000.000-00'
                                    slotProps={{
                                        input: {
                                            inputComponent: Inputs.TextMask as any,
                                            inputProps: {
                                                mask: "000.000.000-00",
                                                onChange: onChange(setStore)
                                            },
                                        }
                                    }} 
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField 
                                    label='Telefone' 
                                    name='telefone' 
                                    value={store.telefone} 
                                    onChange={onChange(setStore)} 
                                    size='small'
                                    placeholder='(00) 00000-0000'
                                    slotProps={{
                                        input: {
                                            inputComponent: Inputs.TextMask as any,
                                            inputProps: {
                                                mask: "(00) 00000-0000",
                                                onChange: onChange(setStore)
                                            },
                                        }
                                    }} 
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField 
                                    label={`Senha${store.id ? ' (deixar em branco para não alterar)' : ''}`}
                                    size='small'
                                    value={store.password}
                                    onChange={(e) => setStore(prev => ({ ...prev, password: e.target.value as string }))}
                                    type={showPassword ? 'text' : 'password'}
                                    slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton size='small' onClick={() => setShowPassword(!showPassword)}>
                                                    <Icon icon={showPassword ? 'solar:eye-closed-linear' : 'solar:eye-linear'} fontSize={20} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
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