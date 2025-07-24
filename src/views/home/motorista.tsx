'use client'

import CustomDialog, { defaultDialogSx, useDialog } from "@/components/dialog/CustomDialog"
import Inputs from "@/components/inputs"
import PageHeader from "@/components/PageHeader"
import { palette } from "@/configs/themeConfig"
import { Veiculo } from "@/entities/veiculo.entity"
import useForm from "@/hooks/useForm"
import axios from "@/utils/axios"
import sweetalert, { toast } from "@/utils/sweetalert"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Alert, Box, Button, ButtonProps, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid2, IconButton, ListItemText, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { DateTime } from "luxon"
import { Session } from "next-auth"
import Link from "next/link"
import React, { ChangeEvent } from "react"

const btnStx: ButtonProps['sx'] = { width: 80, height: 80, borderRadius: 10, boxShadow: 'none !important' }

interface Props {
    session: Session
    veiculos: Veiculo[]
}

type ChecklistDiario = {
    motivo: 'uso' | 'devolucao'
    farois: 'sim' | 'nao' | 'na'
    farois_obs: string
    farois_images: string[]
    lataria: 'sim' | 'nao' | 'na'
    lataria_obs: string
    lataria_images: string[]
    vidros: 'sim' | 'nao' | 'na'
    vidros_obs: string
    vidros_images: string[]
    hodometro: 'sim' | 'nao' | 'na'
    hodometro_obs: string
    hodometro_images: string[]
    combustivel: 'sim' | 'nao' | 'na'
    combustivel_obs: string
    combustivel_images: string[]
    agua: 'sim' | 'nao' | 'na'
    agua_obs: string
    agua_images: string[]
    luzes: 'sim' | 'nao' | 'na'
    luzes_obs: string
    luzes_images: string[]
    selfie_motorista: string
    inicio: string
}

const checklistDiarioDefault: ChecklistDiario = {
    motivo: 'uso',
    farois: 'na',
    farois_obs: '',
    farois_images: [],
    lataria: 'na',
    lataria_obs: '',
    lataria_images: [],
    vidros: 'na',
    vidros_obs: '',
    vidros_images: [],
    hodometro: 'na',
    hodometro_obs: '',
    hodometro_images: [],
    combustivel: 'na',
    combustivel_obs: '',
    combustivel_images: [],
    agua: 'na',
    agua_obs: '',
    agua_images: [],
    luzes: 'na',
    luzes_obs: '',
    luzes_images: [],
    selfie_motorista: '',
    inicio: '',
}

type ChecklistSemanal = {
    motivo: 'uso' | 'devolucao'
    oleo_motor: 'sim' | 'nao' | 'na'
    oleo_motor_obs: string
    oleo_motor_images: string[]
    oleo_freio: 'sim' | 'nao' | 'na'
    oleo_freio_obs: string
    oleo_freio_images: string[]
    agua_limpador: 'sim' | 'nao' | 'na'
    agua_limpador_obs: string
    agua_limpador_images: string[]
    pneus: 'sim' | 'nao' | 'na'
    pneus_obs: string
    pneus_images: string[]
    escapamento: 'sim' | 'nao' | 'na'
    escapamento_obs: string
    escapamento_images: string[]
    vidros: 'sim' | 'nao' | 'na'
    vidros_obs: string
    vidros_images: string[]
    luzes: 'sim' | 'nao' | 'na'
    luzes_obs: string
    luzes_images: string[]
    selfie_motorista: string
    inicio: string
}

const checklistSemanalDefault: ChecklistSemanal = {
    motivo: 'uso',
    oleo_motor: 'na',
    oleo_motor_obs: '',
    oleo_motor_images: [],
    oleo_freio: 'na',
    oleo_freio_obs: '',
    oleo_freio_images: [],
    agua_limpador: 'na',
    agua_limpador_obs: '',
    agua_limpador_images: [],
    pneus: 'na',
    pneus_obs: '',
    pneus_images: [],
    escapamento: 'na',
    escapamento_obs: '',
    escapamento_images: [],
    vidros: 'na',
    vidros_obs: '',
    vidros_images: [],
    luzes: 'na',
    luzes_obs: '',
    luzes_images: [],
    selfie_motorista: '',
    inicio: '',
}

type ChecklistMensal = {
    motivo: 'uso' | 'devolucao'
    estofados: 'sim' | 'nao' | 'na'
    estofados_obs: string
    estofados_images: string[]
    documentacao: 'sim' | 'nao' | 'na'
    documentacao_obs: string
    documentacao_images: string[]
    volante: 'sim' | 'nao' | 'na'
    volante_obs: string
    volante_images: string[]
    cambio: 'sim' | 'nao' | 'na'
    cambio_obs: string
    cambio_images: string[]
    higiene_interna: 'sim' | 'nao' | 'na'
    higiene_interna_obs: string
    higiene_interna_images: string[]
    porta_malas: 'sim' | 'nao' | 'na'
    porta_malas_obs: string
    porta_malas_images: string[]
    bateria: 'sim' | 'nao' | 'na'
    bateria_obs: string
    bateria_images: string[]
    farois: 'sim' | 'nao' | 'na'
    farois_obs: string
    farois_images: string[]
    selfie_motorista: string
    inicio: string
}

const checklistMensalDefault: ChecklistMensal = {
    motivo: 'uso',
    estofados: 'na',
    estofados_obs: '',
    estofados_images: [],
    documentacao: 'na',
    documentacao_obs: '',
    documentacao_images: [],
    volante: 'na',
    volante_obs: '',
    volante_images: [],
    cambio: 'na',
    cambio_obs: '',
    cambio_images: [],
    higiene_interna: 'na',
    higiene_interna_obs: '',
    higiene_interna_images: [],
    porta_malas: 'na',
    porta_malas_obs: '',
    porta_malas_images: [],
    bateria: 'na',
    bateria_obs: '',
    bateria_images: [],
    farois: 'na',
    farois_obs: '',
    farois_images: [],
    selfie_motorista: '',
    inicio: '',
}

export default ({ session, veiculos: _veiculos }: Props) => {
    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [veiculos, setVeiculos] = React.useState<Veiculo[]>(_veiculos)
    const [search, setSearch] = React.useState<string>('')

    const [openChecklist, setOpenChecklist] = React.useState<'diario' | 'semanal' | 'mensal' | null>(null)
    const [openSelfie, setOpenSelfie] = React.useState<boolean>(false)
    
    const [checklist, setChecklist] = React.useState<'diario' | 'semanal' | 'mensal' | null>(null)
    const [veiculo, setVeiculo] = React.useState<Veiculo | null>(null)
    const [selfieImage, setSelfieImage] = React.useState<string | null>(null)
    
    const [diario, setDiario] = React.useState<ChecklistDiario>(checklistDiarioDefault)
    const [semanal, setSemanal] = React.useState<ChecklistSemanal>(checklistSemanalDefault)
    const [mensal, setMensal] = React.useState<ChecklistMensal>(checklistMensalDefault)
    
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const streamRef = React.useRef<MediaStream | null>(null)

    const { openDialog, closeDialog, ...customDialog } = useDialog()

    const onChangeDiario = (key: keyof ChecklistDiario, value: string) => setDiario(prev => ({ ...prev, [key]: value }))
    const onChangeSemanal = (key: keyof ChecklistSemanal, value: string) => setSemanal(prev => ({ ...prev, [key]: value }))
    const onChangeMensal = (key: keyof ChecklistMensal, value: string) => setMensal(prev => ({ ...prev, [key]: value }))
    const isBg = (param: string, value: string, color: string) => param === value ? color : palette.grey['100']
    const isColor = (param: string, value: string, color: string) => param === value ? color : palette.grey['400']
    const hasSelfie = () => Boolean(selfieImage && selfieImage.length > 0)

    const getVeiculo = () => {
        axios.get({ raw: true, url: '/api/data/motorista/veiculos', data: { auth_id: session.user.id }, token: session.accessToken, message: false })
        .then(res => {
            setVeiculos(res.data.veiculos)
        })
        .catch(err => {})
    }

    React.useEffect(() => {
        if (openSelfie && !selfieImage) {
            startCamera()
        }
        return () => {
            stopCamera()
        }
    }, [openSelfie, selfieImage])

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' },
                audio: false 
            })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch (error) {
            console.error('Error accessing camera:', error)
            toast.error({ html: <Typography>Erro ao acessar a câmera. Verifique as permissões.</Typography> })
        }
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            const context = canvas.getContext('2d')
            
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            
            if (context) {
                context.drawImage(video, 0, 0)
                const imageData = canvas.toDataURL('image/jpeg', 0.8)
                setSelfieImage(imageData)
                stopCamera()
            }
        }
    }

    const retakePhoto = () => {
        setSelfieImage(null)
        startCamera()
    }

    const onTakeSelfie = (veiculo: Veiculo, tipo: 'diario' | 'semanal' | 'mensal') => {
        setOpenSelfie(true)
        setSelfieImage(null)
        setVeiculo(veiculo)
        setChecklist(tipo)
        setDiario(checklistDiarioDefault)
        setSemanal(checklistSemanalDefault)
        setMensal(checklistMensalDefault)
    }

    const onCancelSelfie = () => {
        setOpenSelfie(false)
        setSelfieImage(null)
        setChecklist(null)
        setVeiculo(null)
        setDiario(checklistDiarioDefault)
        setSemanal(checklistSemanalDefault)
        setMensal(checklistMensalDefault)
        stopCamera()
    }

    const onAction = (veiculo: Veiculo) => () => {
        if (veiculo.status === 'Andamento' && Number(veiculo.id_usuario) === Number(session.user.id)) {
            onTakeSelfie(veiculo, veiculo.tipo_checklist as 'diario' | 'semanal' | 'mensal')
            return
        } else if (veiculo.status === 'Andamento' && Number(veiculo.id_usuario) !== Number(session.user.id)) {
            toast.warning({ html: <Typography>Outro motorista já está realizando o checklist deste veículo.</Typography> })
            return
        }

        openDialog({
            open: true,
            maxWidth: 'sm',
            fullScreen: mobile,
            title: 'Iniciar checklist',
            content: (
                <React.Fragment>
                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Button color='primary' variant='contained' size='large' fullWidth sx={{ color: 'white' }} onClick={() => onTakeSelfie(veiculo, 'diario')}>
                                Diário
                            </Button>
                        </Grid2>
                        
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Button color='primary' variant='contained' size='large' fullWidth sx={{ color: 'white' }} onClick={() => onTakeSelfie(veiculo, 'semanal')}>
                                Semanal
                            </Button>
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Button color='primary' variant='contained' size='large' fullWidth sx={{ color: 'white' }} onClick={() => onTakeSelfie(veiculo, 'mensal')}>
                                Mensal
                            </Button>
                        </Grid2>
                    </Grid2>
                </React.Fragment>
            ),
            onClose: () => {
                closeDialog()
                setOpenChecklist(null)
                setVeiculo(null)
                setDiario(checklistDiarioDefault)
                setSelfieImage(null)
                setOpenSelfie(false)
                setChecklist(null)
            },
            hasAction: false,
            cancelTitle: 'Cancelar',
            cancelColor: 'primary',
        })
    }

    const onStartChecklist = () => {
        if (veiculo && checklist && selfieImage) {
            setOpenSelfie(false)
            closeDialog()
            sweetalert.loading()

            if (veiculo.status === 'Andamento') {
                sweetalert.close()
                getVeiculo()
                setChecklist(checklist)
                setVeiculo(veiculo)
                setDiario(prev => ({ ...prev, ...checklistDiarioDefault, selfie_motorista: selfieImage, inicio: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') }))
                setSemanal(prev => ({ ...prev, ...checklistSemanalDefault, selfie_motorista: selfieImage, inicio: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') }))
                setMensal(prev => ({ ...prev, ...checklistMensalDefault, selfie_motorista: selfieImage, inicio: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') }))
                setOpenSelfie(false)
                setOpenChecklist(checklist)
            } else {
                axios.post({ raw: true, url: '/api/data/motorista/checklist/iniciar', data: { id_veiculo: veiculo.id, id_usuario: session.user.id, tipo: checklist }, token: session.accessToken })
                .then(res => {
                    sweetalert.close()
                    getVeiculo()
                    setChecklist(checklist)
                    setVeiculo(veiculo)
                    setDiario(prev => ({ ...prev, ...checklistDiarioDefault, selfie_motorista: selfieImage, inicio: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') }))
                    setSemanal(prev => ({ ...prev, ...checklistSemanalDefault, selfie_motorista: selfieImage, inicio: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') }))
                    setMensal(prev => ({ ...prev, ...checklistMensalDefault, selfie_motorista: selfieImage, inicio: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') }))
                    setOpenSelfie(false)
                    setOpenChecklist(checklist)
                })
                .catch(err => {
                    setOpenChecklist(null)
                    setVeiculo(null)
                    setDiario(checklistDiarioDefault)
                    setSemanal(checklistSemanalDefault)
                    setMensal(checklistMensalDefault)
                    setOpenSelfie(false)
                })
            }
        }
    }

    const onCancelChecklist = () => {
        if (veiculo) {
            if (veiculo.id_checklist) {
                getVeiculo()
                setDiario(checklistDiarioDefault)
                setSemanal(checklistSemanalDefault)
                setMensal(checklistMensalDefault)
                setVeiculo(null)
                setChecklist(null)
                setSelfieImage(null)
                setOpenSelfie(false)
                setOpenChecklist(null)
            } else {
                sweetalert.loading()
                axios.post({ raw: true, url: '/api/data/motorista/checklist/cancelar', data: { id_veiculo: veiculo.id, id_usuario: session.user.id }, token: session.accessToken, message: false })
                .then(res => {
                    sweetalert.close()
                    getVeiculo()
                    setDiario(checklistDiarioDefault)
                    setSemanal(checklistSemanalDefault)
                    setMensal(checklistMensalDefault)
                    setVeiculo(null)
                    setChecklist(null)
                    setSelfieImage(null)
                    setOpenSelfie(false)
                    setOpenChecklist(null)
                })
                .catch(err => {
                    sweetalert.close()
                    getVeiculo()
                    setDiario(checklistDiarioDefault)
                    setSemanal(checklistSemanalDefault)
                    setMensal(checklistMensalDefault)
                    setVeiculo(null)
                    setChecklist(null)
                    setSelfieImage(null)
                    setOpenSelfie(false)
                    setOpenChecklist(null)
                })
            }
        }
    }

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const onFileUploadDiario = (key: keyof ChecklistDiario) => async (event: ChangeEvent<HTMLInputElement>) => {
        const __files = event.target.files;
        
        if (!__files || (__files && __files.length === 0)) {
            return;
        }

        const _files: File[] = [];

        for (let i = 0; i < (__files.length > 3 ? 3 : __files.length); i++) {
            const file = __files[i];
            
            if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                toast.error({
                    html: <Typography>
                        O arquivo <strong>{file.name}</strong> não é uma imagem.
                    </Typography>
                });
                continue;
            }

            _files.push(file);
        }

        if (_files.length === 0) {
            return;
        }

        try {
            const base64Files = await Promise.all(_files.map(file => convertFileToBase64(file)));
            setDiario(prev => ({ ...prev, [key]: [...prev[key], ...base64Files] }));
        } catch (error) {
            toast.error({
                html: <Typography>
                    Erro ao processar as imagens. Tente novamente.
                </Typography>
            });
        }
    }

    const onFileUploadSemanal = (key: keyof ChecklistSemanal) => async (event: ChangeEvent<HTMLInputElement>) => {
        const __files = event.target.files;
        
        if (!__files || (__files && __files.length === 0)) {
            return;
        }

        const _files: File[] = [];

        for (let i = 0; i < (__files.length > 3 ? 3 : __files.length); i++) {
            const file = __files[i];
            
            if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                toast.error({
                    html: <Typography>
                        O arquivo <strong>{file.name}</strong> não é uma imagem.
                    </Typography>
                });
                continue;
            }

            _files.push(file);
        }

        if (_files.length === 0) {
            return;
        }

        try {
            const base64Files = await Promise.all(_files.map(file => convertFileToBase64(file)));
            setSemanal(prev => ({ ...prev, [key]: [...prev[key], ...base64Files] }));
        } catch (error) {
            toast.error({
                html: <Typography>
                    Erro ao processar as imagens. Tente novamente.
                </Typography>
            });
        }
    }

    const onFileUploadMensal = (key: keyof ChecklistMensal) => async (event: ChangeEvent<HTMLInputElement>) => {
        const __files = event.target.files;
        
        if (!__files || (__files && __files.length === 0)) {
            return;
        }

        const _files: File[] = [];

        for (let i = 0; i < (__files.length > 3 ? 3 : __files.length); i++) {
            const file = __files[i];
            
            if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                toast.error({
                    html: <Typography>
                        O arquivo <strong>{file.name}</strong> não é uma imagem.
                    </Typography>
                });
                continue;
            }

            _files.push(file);
        }

        if (_files.length === 0) {
            return;
        }

        try {
            const base64Files = await Promise.all(_files.map(file => convertFileToBase64(file)));
            setMensal(prev => ({ ...prev, [key]: [...prev[key], ...base64Files] }));
        } catch (error) {
            toast.error({
                html: <Typography>
                    Erro ao processar as imagens. Tente novamente.
                </Typography>
            });
        }
    }

    const onSaveChecklistDiario = () => {
        if (veiculo && checklist && selfieImage && diario) {
            sweetalert.loading()

            let errors: string[] = []
            
            if (diario.farois === 'sim' && (diario.farois_images.length === 0 || diario.farois_obs.length === 0)) {
                if (diario.farois_images.length === 0) {
                    errors.push('É necessário enviar pelo menos uma imagem para os faróis.')
                }

                if (diario.farois_obs.length === 0) {
                    errors.push('É necessário preencher o campo de observação para os faróis.')
                }
            }

            if (diario.lataria === 'sim' && (diario.lataria_images.length === 0 || diario.lataria_obs.length === 0)) {
                if (diario.lataria_images.length === 0) {
                    errors.push('É necessário enviar pelo menos uma imagem para a lataria.')
                }

                if (diario.lataria_obs.length === 0) {
                    errors.push('É necessário preencher o campo de observação para a lataria.')
                }
            }

            if (diario.vidros === 'sim' && (diario.vidros_images.length === 0 || diario.vidros_obs.length === 0)) {
                if (diario.vidros_images.length === 0) {
                    errors.push('É necessário enviar pelo menos uma imagem para os vidros.')
                }

                if (diario.vidros_obs.length === 0) {
                    errors.push('É necessário preencher o campo de observação para os vidros.')
                }
            }

            if (diario.hodometro === 'sim' && (diario.hodometro_images.length === 0 || diario.hodometro_obs.length === 0)) {
                if (diario.hodometro_images.length === 0) {
                    errors.push('É necessário enviar pelo menos uma imagem para o hodômetro.')
                }

                if (diario.hodometro_obs.length === 0) {
                    errors.push('É necessário preencher o campo de observação para o hodômetro.')
                }
            }

            if (diario.combustivel === 'sim' && (diario.combustivel_images.length === 0 || diario.combustivel_obs.length === 0)) {
                if (diario.combustivel_images.length === 0) {
                    errors.push('É necessário enviar pelo menos uma imagem para o combustível.')
                }

                if (diario.combustivel_obs.length === 0) {
                    errors.push('É necessário preencher o campo de observação para o combustível.')
                }
            }

            if (diario.agua === 'sim' && (diario.agua_images.length === 0 || diario.agua_obs.length === 0)) {
                if (diario.agua_images.length === 0) {
                    errors.push('É necessário enviar pelo menos uma imagem para a água.')
                }

                if (diario.agua_obs.length === 0) {
                    errors.push('É necessário preencher o campo de observação para a água.')
                }
            }

            if (diario.luzes === 'sim' && (diario.luzes_images.length === 0 || diario.luzes_obs.length === 0)) {
                if (diario.luzes_images.length === 0) {
                    errors.push('É necessário enviar pelo menos uma imagem para as luzes.')
                }

                if (diario.luzes_obs.length === 0) {
                    errors.push('É necessário preencher o campo de observação para as luzes.')
                }
            }

            if (errors.length > 0) {
                sweetalert.close()
                openDialog({
                    open: true,
                    maxWidth: 'sm',
                    fullScreen: mobile,
                    title: 'Erros encontrados',
                    content: (
                        <React.Fragment>
                            {errors.map(error => (
                                <Typography key={`error-${error}`} sx={{ color: theme => theme.palette.error.main, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2, textAlign: 'center' }}>
                                    {error}
                                </Typography>
                            ))}
                        </React.Fragment>
                    ),
                    onClose: () => {
                        closeDialog()
                    },
                    hasAction: false,
                    cancelTitle: 'Fechar',
                    cancelColor: 'primary',
                })
                return;
            }

            axios.post({ raw: true, url: '/api/data/motorista/checklist/diario', data: { id_veiculo: veiculo.id, id_usuario: session.user.id, tipo: checklist, ...diario }, token: session.accessToken })
            .then(res => {
                toast.success({
                    html: <Typography>{res.data.message}</Typography>
                })
                getVeiculo()
                setDiario(checklistDiarioDefault)
                setVeiculo(null)
                setChecklist(null)
                setSelfieImage(null)
                setOpenSelfie(false)
                setOpenChecklist(null)
            })
            .catch(err => {
                
            })
        }
    }

    const onSaveChecklistSemanal = () => {
        if (veiculo && checklist && selfieImage && semanal) {
            sweetalert.loading()

            let errors: string[] = []

            if (semanal.oleo_motor === 'nao' && semanal.oleo_motor_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para o óleo do motor.')
            }

            if (semanal.oleo_motor === 'nao' && semanal.oleo_motor_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para o óleo do motor.')
            }

            if (semanal.agua_limpador === 'nao' && semanal.agua_limpador_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para a água do limpador.')
            }

            if (semanal.agua_limpador === 'nao' && semanal.agua_limpador_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para a água do limpador.')
            }

            if (semanal.oleo_freio === 'nao' && semanal.oleo_freio_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para o óleo do freio.')
            }

            if (semanal.oleo_freio === 'nao' && semanal.oleo_freio_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para o óleo do freio.')
            }

            if (semanal.pneus === 'nao' && semanal.pneus_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para os pneus.')
            }

            if (semanal.pneus === 'nao' && semanal.pneus_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para os pneus.')
            }

            if (semanal.escapamento === 'nao' && semanal.escapamento_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para o escapamento.')
            }

            if (semanal.escapamento === 'nao' && semanal.escapamento_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para o escapamento.')
            }

            if (semanal.vidros === 'nao' && semanal.vidros_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para os vidros.')
            }

            if (semanal.vidros === 'nao' && semanal.vidros_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para os vidros.')
            }

            if (semanal.luzes === 'nao' && semanal.luzes_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para as luzes.')
            }

            if (semanal.luzes === 'nao' && semanal.luzes_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para as luzes.')
            }

            if (errors.length > 0) {
                sweetalert.close()
                openDialog({
                    open: true,
                    maxWidth: 'sm',
                    fullScreen: mobile,
                    title: 'Erros encontrados',
                    content: (
                        <React.Fragment>
                            {errors.map(error => (
                                <Typography key={`error-${error}`} sx={{ color: theme => theme.palette.error.main, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2, textAlign: 'center' }}>
                                    {error}
                                </Typography>
                            ))}
                        </React.Fragment>
                    ),
                    onClose: () => {
                        closeDialog()
                    },
                    hasAction: false,
                    cancelTitle: 'Fechar',
                    cancelColor: 'primary',
                })
                return;
            }

            axios.post({ raw: true, url: '/api/data/motorista/checklist/semanal', data: { id_veiculo: veiculo.id, id_usuario: session.user.id, tipo: checklist, ...semanal }, token: session.accessToken })
            .then(res => {
                toast.success({
                    html: <Typography>{res.data.message}</Typography>
                })
                getVeiculo()
                setSemanal(checklistSemanalDefault)
                setVeiculo(null)
                setChecklist(null)
                setSelfieImage(null)
                setOpenSelfie(false)
                setOpenChecklist(null)
            })
            .catch(err => {
                
            })
        }
    }

    const onSaveChecklistMensal = () => {
        if (veiculo && checklist && selfieImage && mensal) {
            sweetalert.loading()

            let errors: string[] = []

            if (mensal.bateria === 'nao' && mensal.bateria_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para a bateria.')
            }

            if (mensal.bateria === 'nao' && mensal.bateria_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para a bateria.')
            }

            if (mensal.farois === 'nao' && mensal.farois_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para os faróis.')
            }

            if (mensal.farois === 'nao' && mensal.farois_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para os faróis.')
            }

            if (mensal.estofados === 'nao' && mensal.estofados_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para os estofados.')
            }

            if (mensal.estofados === 'nao' && mensal.estofados_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para os estofados.')
            }

            if (mensal.documentacao === 'nao' && mensal.documentacao_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para a documentação.')
            }

            if (mensal.documentacao === 'nao' && mensal.documentacao_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para a documentação.')
            }

            if (mensal.volante === 'nao' && mensal.volante_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para o volante.')
            }

            if (mensal.volante === 'nao' && mensal.volante_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para o volante.')
            }

            if (mensal.cambio === 'nao' && mensal.cambio_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para o câmbio.')
            }

            if (mensal.cambio === 'nao' && mensal.cambio_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para o câmbio.')
            }

            if (mensal.higiene_interna === 'nao' && mensal.higiene_interna_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para a higiene interna.')
            }

            if (mensal.higiene_interna === 'nao' && mensal.higiene_interna_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para a higiene interna.')
            }

            if (mensal.porta_malas === 'nao' && mensal.porta_malas_images.length === 0) {
                errors.push('É necessário enviar pelo menos uma imagem para a porta malas.')
            }

            if (mensal.porta_malas === 'nao' && mensal.porta_malas_obs.length === 0) {
                errors.push('É necessário preencher o campo de observação para a porta malas.')
            }

            if (errors.length > 0) {
                sweetalert.close()
                openDialog({
                    open: true,
                    maxWidth: 'sm',
                    fullScreen: mobile,
                    title: 'Erros encontrados',
                    content: (
                        <React.Fragment>
                            {errors.map(error => (
                                <Typography key={`error-${error}`} sx={{ color: theme => theme.palette.error.main, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2, textAlign: 'center' }}>
                                    {error}
                                </Typography>
                            ))}
                        </React.Fragment>
                    ),
                    onClose: () => {
                        closeDialog()
                    },
                    hasAction: false,
                    cancelTitle: 'Fechar',
                    cancelColor: 'primary',
                })
                return;
            }

            axios.post({ raw: true, url: '/api/data/motorista/checklist/mensal', data: { id_veiculo: veiculo.id, id_usuario: session.user.id, tipo: checklist, ...mensal }, token: session.accessToken })
            .then(res => {
                toast.success({
                    html: <Typography>{res.data.message}</Typography>
                })
                getVeiculo()
                setMensal(checklistMensalDefault)
                setVeiculo(null)
                setChecklist(null)
                setSelfieImage(null)
                setOpenSelfie(false)
                setOpenChecklist(null)
            })
            .catch(err => {
                
            })
        }
    }

    return (
        <React.Fragment>
            <Grid2 container spacing={6}>
                <PageHeader title={(
                    <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '2rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                        Painel de Veículos
                    </Typography>
                )} />

                <Grid2 size={{ xs: 12 }}>
                    <Grid2 container spacing={6} justifyContent='space-between' alignItems='center'>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Inputs.TextField label='Buscar por placa' name='search' value={search} onChange={e => setSearch(e.target.value)} size='small' />
                        </Grid2>
                    </Grid2>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Grid2 container spacing={4}>
                        {(search ? veiculos.filter(veiculo => veiculo.placa.toLowerCase().includes(search.toLowerCase())) : veiculos).map(veiculo => (
                            <Grid2 size={{ xs: 12, sm: 3 }} key={`veiculo-${veiculo.id}`}>
                                <Card sx={{ cursor: 'pointer' }} onClick={onAction(veiculo)}>
                                    <CardContent sx={{ px: 3, py: '.75rem !important' }}>
                                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                            <strong>Placa:</strong> {veiculo.placa.replaceAll('-', '')}
                                        </Typography>
                                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                            <strong>Último checklist:</strong> {veiculo.ultimo_checklist ? DateTime.fromSQL(veiculo.ultimo_checklist).toFormat('dd/MM/yyyy HH:mm'): 'N/A'}
                                        </Typography>
                                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                            <strong>Último checklist:</strong> {veiculo.ultimo_checklist}
                                        </Typography>

                                        {veiculo.status === 'Andamento' && Number(veiculo.id_usuario) === Number(session.user.id) && (
                                            <Button color='primary' variant='contained' size='small' sx={{ width: '100%', color: 'white' }}>
                                                Continuar checklist
                                            </Button>
                                        )}

                                        {veiculo.status === 'Andamento' && Number(veiculo.id_usuario) !== Number(session.user.id) && (
                                            <Button color='primary' variant='contained' size='small' sx={{ width: '100%', color: 'white' }} disabled>
                                                Checklist em andamento
                                            </Button>
                                        )}

                                        {veiculo.status !== 'Andamento' && (
                                            <Button color='primary' variant='contained' size='small' sx={{ width: '100%', color: 'white' }}>
                                                Iniciar checklist
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                </Grid2>
            </Grid2>

            <CustomDialog {...customDialog} />

            <Dialog fullWidth maxWidth='sm' fullScreen={mobile} sx={{ ...defaultDialogSx }} open={openSelfie} onClose={onCancelSelfie}>
                <DialogTitle>
                    <Typography sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '1.5rem', color: theme => theme.palette.primary.main }}>
                        Tirar selfie para autenticação
                    </Typography>
                </DialogTitle>

                <DialogContent>
                {/* 
                    Componente para abrir a câmera e tirar uma foto.
                    Usamos um elemento de vídeo para mostrar a câmera e um canvas para capturar a imagem.
                */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                    {!selfieImage && openSelfie ? (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                width={mobile ? 300 : 400}
                                height={mobile ? 400 : 300}
                                style={{ borderRadius: 12, background: '#000', objectFit: 'cover' }}
                            />
                            <Typography sx={{ mt: 2, color: theme => theme.palette.text.secondary }}>
                                Posicione seu rosto dentro do quadro e clique em "Tirar foto"
                            </Typography>
                        </>
                    ) : (
                        <>
                            <img
                                src={selfieImage ?? ''}
                                alt="Selfie capturada"
                                style={{ width: mobile ? 300 : 400, height: mobile ? 400 : 300, borderRadius: 12, objectFit: 'cover' }}
                            />
                            <Typography sx={{ mt: 2, color: theme => theme.palette.text.secondary }}>
                                Foto capturada com sucesso! Clique em "Continuar" para prosseguir.
                            </Typography>
                        </>
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onCancelSelfie} color='error'>Cancelar</Button>
                    {!selfieImage ? (
                        <Button color='primary' onClick={capturePhoto}>Tirar foto</Button>
                    ) : (
                        <>
                            <Button color='secondary' onClick={retakePhoto}>Tirar nova foto</Button>
                            <Button color='primary' onClick={onStartChecklist}>Continuar</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog fullWidth maxWidth='sm' fullScreen={mobile} sx={{ ...defaultDialogSx }} open={openChecklist === 'diario'} onClose={onCancelChecklist}>
                <DialogTitle>
                    <Typography sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '1.5rem', color: theme => theme.palette.primary.main }}>
                        Checklist Diário
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <Grid2 container spacing={6} sx={{ mt: 3 }}>
                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.Select 
                                    label='Motivo'
                                    name='motivo'
                                    value={diario.motivo}
                                    multiple={false}
                                    options={['uso', 'devolucao']}
                                    size='small'
                                    optionComponent={(option: string) => (
                                        <MenuItem key={`select-checklist-diario-motivo-${option}`} value={option}>
                                            <ListItemText primary={option === 'uso' ? 'Uso' : 'Devolução'} />
                                        </MenuItem>
                                    )}
                                    render={(selected: string) => selected === 'uso' ? 'Uso' : 'Devolução'}
                                    onChange={(e) => onChangeDiario('motivo', e.target.value as 'uso' | 'devolucao')}
                                    labelProps={{ sx: { '&.MuiFormLabel-filled': {fontWeight: 700} } }}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Os faróis estão danificados?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.farois, 'nao', palette.success['500']) }} onClick={() => onChangeDiario('farois', 'nao')}>
                                        <Typography sx={{ color: isColor(diario.farois, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.farois, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('farois', 'na')}>
                                        <Typography sx={{ color: isColor(diario.farois, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.farois, 'sim', palette.error['600']) }} onClick={() => onChangeDiario('farois', 'sim')}>
                                        <Typography sx={{ color: isColor(diario.farois, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {diario.farois === 'sim' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Faróis - Observações' name='farois_obs' multiline rows={2} value={diario.farois_obs} onChange={(e) => onChangeDiario('farois_obs', e.target.value)} />
                                    </Box>
                                )}
                                {diario.farois === 'sim' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadDiario('farois_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    A lataria possui amassados expressivos?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.lataria, 'nao', palette.success['500']) }} onClick={() => onChangeDiario('lataria', 'nao')}>
                                        <Typography sx={{ color: isColor(diario.lataria, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.lataria, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('lataria', 'na')}>
                                        <Typography sx={{ color: isColor(diario.lataria, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.lataria, 'sim', palette.error['600']) }} onClick={() => onChangeDiario('lataria', 'sim')}>
                                        <Typography sx={{ color: isColor(diario.lataria, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {diario.lataria === 'sim' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Lataria - Observações' name='lataria_obs' multiline rows={2} value={diario.lataria_obs} onChange={(e) => onChangeDiario('lataria_obs', e.target.value)} />
                                    </Box>
                                )}
                                {diario.lataria === 'sim' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadDiario('lataria_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    O prabrisas e os retrovisores estão danificados?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.vidros, 'nao', palette.success['500']) }} onClick={() => onChangeDiario('vidros', 'nao')}>
                                        <Typography sx={{ color: isColor(diario.vidros, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.vidros, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('vidros', 'na')}>
                                        <Typography sx={{ color: isColor(diario.vidros, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.vidros, 'sim', palette.error['600']) }} onClick={() => onChangeDiario('vidros', 'sim')}>
                                        <Typography sx={{ color: isColor(diario.vidros, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {diario.vidros === 'sim' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Vidros - Observações' name='vidros_obs' multiline rows={2} value={diario.vidros_obs} onChange={(e) => onChangeDiario('vidros_obs', e.target.value)} />
                                    </Box>
                                )}
                                {diario.vidros === 'sim' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadDiario('vidros_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    O hodômetro está danificado?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.hodometro, 'nao', palette.success['500']) }} onClick={() => onChangeDiario('hodometro', 'nao')}>
                                        <Typography sx={{ color: isColor(diario.hodometro, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.hodometro, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('hodometro', 'na')}>
                                        <Typography sx={{ color: isColor(diario.hodometro, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.hodometro, 'sim', palette.error['600']) }} onClick={() => onChangeDiario('hodometro', 'sim')}>
                                        <Typography sx={{ color: isColor(diario.hodometro, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {diario.hodometro === 'sim' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Hodômetro - Observações' name='hodometro_obs' multiline rows={2} value={diario.hodometro_obs} onChange={(e) => onChangeDiario('hodometro_obs', e.target.value)} />
                                    </Box>
                                )}
                                {diario.hodometro === 'sim' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadDiario('hodometro_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Está sem combustível no veículo?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.combustivel, 'nao', palette.success['500']) }} onClick={() => onChangeDiario('combustivel', 'nao')}>
                                        <Typography sx={{ color: isColor(diario.combustivel, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.combustivel, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('combustivel', 'na')}>
                                        <Typography sx={{ color: isColor(diario.combustivel, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.combustivel, 'sim', palette.error['600']) }} onClick={() => onChangeDiario('combustivel', 'sim')}>
                                        <Typography sx={{ color: isColor(diario.combustivel, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {diario.combustivel === 'sim' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Combustível - Observações' name='combustivel_obs' multiline rows={2} value={diario.combustivel_obs} onChange={(e) => onChangeDiario('combustivel_obs', e.target.value)} />
                                    </Box>
                                )}
                                {diario.combustivel === 'sim' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadDiario('combustivel_images')} />
                                    </Button>
                                )}  
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Está sem água no radiador?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.agua, 'nao', palette.success['500']) }} onClick={() => onChangeDiario('agua', 'nao')}>
                                        <Typography sx={{ color: isColor(diario.agua, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.agua, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('agua', 'na')}>
                                        <Typography sx={{ color: isColor(diario.agua, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.agua, 'sim', palette.error['600']) }} onClick={() => onChangeDiario('agua', 'sim')}>
                                        <Typography sx={{ color: isColor(diario.agua, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {diario.agua === 'sim' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Água - Observações' name='agua_obs' multiline rows={2} value={diario.agua_obs} onChange={(e) => onChangeDiario('agua_obs', e.target.value)} />
                                    </Box>
                                )}
                                {diario.agua === 'sim' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadDiario('agua_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Existem luzes acesas no painel do veículo antes do serviço?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.luzes, 'nao', palette.success['500']) }} onClick={() => onChangeDiario('luzes', 'nao')}>
                                        <Typography sx={{ color: isColor(diario.luzes, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.luzes, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('luzes', 'na')}>
                                        <Typography sx={{ color: isColor(diario.luzes, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.luzes, 'sim', palette.error['600']) }} onClick={() => onChangeDiario('luzes', 'sim')}>
                                        <Typography sx={{ color: isColor(diario.luzes, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {diario.luzes === 'sim' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Luzes - Observações' name='luzes_obs' multiline rows={2} value={diario.luzes_obs} onChange={(e) => onChangeDiario('luzes_obs', e.target.value)} />
                                    </Box>
                                )}
                                {diario.luzes === 'sim' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadDiario('luzes_images')} />
                                    </Button>
                                )}
                            </Grid2>
                        </Grid2>
                    </LocalizationProvider>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onCancelChecklist} color='error'>Cancelar</Button>
                    <Button color='primary' onClick={onSaveChecklistDiario}>Finalizar checklist</Button>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth maxWidth='sm' fullScreen={mobile} sx={{ ...defaultDialogSx }} open={openChecklist === 'mensal'} onClose={onCancelChecklist}>
                <DialogTitle>
                    <Typography sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '1.5rem', color: theme => theme.palette.primary.main }}>
                        Checklist Mensal
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <Grid2 container spacing={6} sx={{ mt: 3 }}>
                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.Select 
                                    label='Motivo'
                                    name='motivo'
                                    value={mensal.motivo}
                                    multiple={false}
                                    options={['uso', 'devolucao']}
                                    size='small'
                                    optionComponent={(option: string) => (
                                        <MenuItem key={`select-checklist-mensal-motivo-${option}`} value={option}>
                                            <ListItemText primary={option === 'uso' ? 'Uso' : 'Devolução'} />
                                        </MenuItem>
                                    )}
                                    render={(selected: string) => selected === 'uso' ? 'Uso' : 'Devolução'}
                                    onChange={(e) => onChangeMensal('motivo', e.target.value as 'uso' | 'devolucao')}
                                    labelProps={{ sx: { '&.MuiFormLabel-filled': {fontWeight: 700} } }}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Verificado o estado dos estofados?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.estofados, 'nao', palette.error['600']) }} onClick={() => onChangeMensal('estofados', 'nao')}>
                                        <Typography sx={{ color: isColor(mensal.estofados, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.estofados, 'na', palette.grey['300']) }} onClick={() => onChangeMensal('estofados', 'na')}>
                                        <Typography sx={{ color: isColor(mensal.estofados, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.estofados, 'sim', palette.success['500']) }} onClick={() => onChangeMensal('estofados', 'sim')}>
                                        <Typography sx={{ color: isColor(mensal.estofados, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {mensal.estofados === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Estofados - Observações' name='estofados_obs' multiline rows={2} value={mensal.estofados_obs} onChange={(e) => onChangeMensal('estofados_obs', e.target.value)} />
                                    </Box>
                                )}
                                {mensal.estofados === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadMensal('estofados_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Documentação em dia?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.documentacao, 'nao', palette.error['600']) }} onClick={() => onChangeMensal('documentacao', 'nao')}>
                                        <Typography sx={{ color: isColor(mensal.documentacao, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.documentacao, 'na', palette.grey['300']) }} onClick={() => onChangeMensal('documentacao', 'na')}>
                                        <Typography sx={{ color: isColor(mensal.documentacao, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.documentacao, 'sim', palette.success['500']) }} onClick={() => onChangeMensal('documentacao', 'sim')}>
                                        <Typography sx={{ color: isColor(mensal.documentacao, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {mensal.documentacao === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Documentação - Observações' name='documentacao_obs' multiline rows={2} value={mensal.documentacao_obs} onChange={(e) => onChangeMensal('documentacao_obs', e.target.value)} />
                                    </Box>
                                )}
                                {mensal.documentacao === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadMensal('documentacao_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Verificado o estado de conservação do volante?      
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.volante, 'nao', palette.error['600']) }} onClick={() => onChangeMensal('volante', 'nao')}>
                                        <Typography sx={{ color: isColor(mensal.volante, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.volante, 'na', palette.grey['300']) }} onClick={() => onChangeMensal('volante', 'na')}>
                                        <Typography sx={{ color: isColor(mensal.volante, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.volante, 'sim', palette.success['500']) }} onClick={() => onChangeMensal('volante', 'sim')}>
                                        <Typography sx={{ color: isColor(mensal.volante, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {mensal.volante === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Volante - Observações' name='volante_obs' multiline rows={2} value={mensal.volante_obs} onChange={(e) => onChangeMensal('volante_obs', e.target.value)} />
                                    </Box>
                                )}
                                {mensal.volante === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadMensal('volante_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Verificado o estado de conservação do câmbio?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.cambio, 'nao', palette.error['600']) }} onClick={() => onChangeMensal('cambio', 'nao')}>
                                        <Typography sx={{ color: isColor(mensal.cambio, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.cambio, 'na', palette.grey['300']) }} onClick={() => onChangeMensal('cambio', 'na')}>
                                        <Typography sx={{ color: isColor(mensal.cambio, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.cambio, 'sim', palette.success['500']) }} onClick={() => onChangeMensal('cambio', 'sim')}>
                                        <Typography sx={{ color: isColor(mensal.cambio, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {mensal.cambio === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Câmbio - Observações' name='cambio_obs' multiline rows={2} value={mensal.cambio_obs} onChange={(e) => onChangeMensal('cambio_obs', e.target.value)} />
                                    </Box>
                                )}
                                {mensal.cambio === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadMensal('cambio_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Higiene interna está adequada?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.higiene_interna, 'nao', palette.error['600']) }} onClick={() => onChangeMensal('higiene_interna', 'nao')}>
                                        <Typography sx={{ color: isColor(mensal.higiene_interna, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.higiene_interna, 'na', palette.grey['300']) }} onClick={() => onChangeMensal('higiene_interna', 'na')}>
                                        <Typography sx={{ color: isColor(mensal.higiene_interna, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.higiene_interna, 'sim', palette.success['500']) }} onClick={() => onChangeMensal('higiene_interna', 'sim')}>
                                        <Typography sx={{ color: isColor(mensal.higiene_interna, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {mensal.higiene_interna === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Higiene interna - Observações' name='higiene_interna_obs' multiline rows={2} value={mensal.higiene_interna_obs} onChange={(e) => onChangeMensal('higiene_interna_obs', e.target.value)} />
                                    </Box>
                                )}
                                {mensal.higiene_interna === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadMensal('higiene_interna_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Porta-malas em boas condições?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.porta_malas, 'nao', palette.error['600']) }} onClick={() => onChangeMensal('porta_malas', 'nao')}>
                                        <Typography sx={{ color: isColor(mensal.porta_malas, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.porta_malas, 'na', palette.grey['300']) }} onClick={() => onChangeMensal('porta_malas', 'na')}>
                                        <Typography sx={{ color: isColor(mensal.porta_malas, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.porta_malas, 'sim', palette.success['500']) }} onClick={() => onChangeMensal('porta_malas', 'sim')}>
                                        <Typography sx={{ color: isColor(mensal.porta_malas, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {mensal.porta_malas === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Porta-malas - Observações' name='porta_malas_obs' multiline rows={2} value={mensal.porta_malas_obs} onChange={(e) => onChangeMensal('porta_malas_obs', e.target.value)} />
                                    </Box>
                                )}
                                {mensal.porta_malas === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadMensal('porta_malas_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Bateria em bom estado?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.bateria, 'nao', palette.error['600']) }} onClick={() => onChangeMensal('bateria', 'nao')}>
                                        <Typography sx={{ color: isColor(mensal.bateria, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.bateria, 'na', palette.grey['300']) }} onClick={() => onChangeMensal('bateria', 'na')}>
                                        <Typography sx={{ color: isColor(mensal.bateria, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.bateria, 'sim', palette.success['500']) }} onClick={() => onChangeMensal('bateria', 'sim')}>
                                        <Typography sx={{ color: isColor(mensal.bateria, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {mensal.bateria === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Bateria - Observações' name='bateria_obs' multiline rows={2} value={mensal.bateria_obs} onChange={(e) => onChangeMensal('bateria_obs', e.target.value)} />
                                    </Box>
                                )}
                                {mensal.bateria === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadMensal('bateria_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Faróis funcionando corretamente?    
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.farois, 'nao', palette.error['600']) }} onClick={() => onChangeMensal('farois', 'nao')}>
                                        <Typography sx={{ color: isColor(mensal.farois, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.farois, 'na', palette.grey['300']) }} onClick={() => onChangeMensal('farois', 'na')}>
                                        <Typography sx={{ color: isColor(mensal.farois, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(mensal.farois, 'sim', palette.success['500']) }} onClick={() => onChangeMensal('farois', 'sim')}>
                                        <Typography sx={{ color: isColor(mensal.farois, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {mensal.farois === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Faróis - Observações' name='farois_obs' multiline rows={2} value={mensal.farois_obs} onChange={(e) => onChangeMensal('farois_obs', e.target.value)} />
                                    </Box>
                                )}
                                {mensal.farois === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadMensal('farois_images')} />
                                    </Button>
                                )}
                            </Grid2>
                        </Grid2>
                    </LocalizationProvider>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onCancelChecklist} color='error'>Cancelar</Button>
                    <Button color='primary' onClick={onSaveChecklistMensal}>Finalizar checklist</Button>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth maxWidth='sm' fullScreen={mobile} sx={{ ...defaultDialogSx }} open={openChecklist === 'semanal'} onClose={onCancelChecklist}>
                <DialogTitle>
                    <Typography sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '1.5rem', color: theme => theme.palette.primary.main }}>
                        Checklist Semanal
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <Grid2 container spacing={6} sx={{ mt: 3 }}>
                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.Select 
                                    label='Motivo'
                                    name='motivo'
                                    value={semanal.motivo}
                                    multiple={false}
                                    options={['uso', 'devolucao']}
                                    size='small'
                                    optionComponent={(option: string) => (
                                        <MenuItem key={`select-checklist-mensal-motivo-${option}`} value={option}>
                                            <ListItemText primary={option === 'uso' ? 'Uso' : 'Devolução'} />
                                        </MenuItem>
                                    )}
                                    render={(selected: string) => selected === 'uso' ? 'Uso' : 'Devolução'}
                                    onChange={(e) => onChangeSemanal('motivo', e.target.value as 'uso' | 'devolucao')}
                                    labelProps={{ sx: { '&.MuiFormLabel-filled': {fontWeight: 700} } }}
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Verificado o nível de óleo do motor?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.oleo_motor, 'nao', palette.error['600']) }} onClick={() => onChangeSemanal('oleo_motor', 'nao')}>
                                        <Typography sx={{ color: isColor(semanal.oleo_motor, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.oleo_motor, 'na', palette.grey['300']) }} onClick={() => onChangeSemanal('oleo_motor', 'na')}>
                                        <Typography sx={{ color: isColor(semanal.oleo_motor, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.oleo_motor, 'sim', palette.success['500']) }} onClick={() => onChangeSemanal('oleo_motor', 'sim')}>
                                        <Typography sx={{ color: isColor(semanal.oleo_motor, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {semanal.oleo_motor === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Oleo do motor - Observações' name='oleo_motor_obs' multiline rows={2} value={semanal.oleo_motor_obs} onChange={(e) => onChangeSemanal('oleo_motor_obs', e.target.value)} />
                                    </Box>
                                )}
                                {semanal.oleo_motor === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadSemanal('oleo_motor_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Verificado o nível de água do limpador dos vidros?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.agua_limpador, 'nao', palette.error['600']) }} onClick={() => onChangeSemanal('agua_limpador', 'nao')}>
                                        <Typography sx={{ color: isColor(semanal.agua_limpador, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.agua_limpador, 'na', palette.grey['300']) }} onClick={() => onChangeSemanal('agua_limpador', 'na')}>
                                        <Typography sx={{ color: isColor(semanal.agua_limpador, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.agua_limpador, 'sim', palette.success['500']) }} onClick={() => onChangeSemanal('agua_limpador', 'sim')}>
                                        <Typography sx={{ color: isColor(semanal.agua_limpador, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {semanal.agua_limpador === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Água do limpador - Observações' name='agua_limpador_obs' multiline rows={2} value={semanal.agua_limpador_obs} onChange={(e) => onChangeSemanal('agua_limpador_obs', e.target.value)} />
                                    </Box>
                                )}
                                {semanal.agua_limpador === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadSemanal('agua_limpador_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Verificado o nível do óleo do freio?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.oleo_freio, 'nao', palette.error['600']) }} onClick={() => onChangeSemanal('oleo_freio', 'nao')}>
                                        <Typography sx={{ color: isColor(semanal.oleo_freio, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.oleo_freio, 'na', palette.grey['300']) }} onClick={() => onChangeSemanal('oleo_freio', 'na')}>
                                        <Typography sx={{ color: isColor(semanal.oleo_freio, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.oleo_freio, 'sim', palette.success['500']) }} onClick={() => onChangeSemanal('oleo_freio', 'sim')}>
                                        <Typography sx={{ color: isColor(semanal.oleo_freio, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {semanal.oleo_freio === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Óleo do freio - Observações' name='oleo_freio_obs' multiline rows={2} value={semanal.oleo_freio_obs} onChange={(e) => onChangeSemanal('oleo_freio_obs', e.target.value)} />
                                    </Box>
                                )}
                                {semanal.oleo_freio === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadSemanal('oleo_freio_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Verificado o estado de conservação dos pneus?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.pneus, 'nao', palette.error['600']) }} onClick={() => onChangeSemanal('pneus', 'nao')}>
                                        <Typography sx={{ color: isColor(semanal.pneus, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.pneus, 'na', palette.grey['300']) }} onClick={() => onChangeSemanal('pneus', 'na')}>
                                        <Typography sx={{ color: isColor(semanal.pneus, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.pneus, 'sim', palette.success['500']) }} onClick={() => onChangeSemanal('pneus', 'sim')}>
                                        <Typography sx={{ color: isColor(semanal.pneus, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {semanal.pneus === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Pneus - Observações' name='pneus_obs' multiline rows={2} value={semanal.pneus_obs} onChange={(e) => onChangeSemanal('pneus_obs', e.target.value)} />
                                    </Box>
                                )}
                                {semanal.pneus === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadSemanal('pneus_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Verificado o estado de conservação do escapamento?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.escapamento, 'nao', palette.error['600']) }} onClick={() => onChangeSemanal('escapamento', 'nao')}>
                                        <Typography sx={{ color: isColor(semanal.escapamento, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.escapamento, 'na', palette.grey['300']) }} onClick={() => onChangeSemanal('escapamento', 'na')}>
                                        <Typography sx={{ color: isColor(semanal.escapamento, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.escapamento, 'sim', palette.success['500']) }} onClick={() => onChangeSemanal('escapamento', 'sim')}>
                                        <Typography sx={{ color: isColor(semanal.escapamento, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {semanal.escapamento === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Escapamento - Observações' name='escapamento_obs' multiline rows={2} value={semanal.escapamento_obs} onChange={(e) => onChangeSemanal('escapamento_obs', e.target.value)} />
                                    </Box>
                                )}
                                {semanal.escapamento === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadSemanal('escapamento_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Verificado o estado de conservação dos vidros?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.vidros, 'nao', palette.error['600']) }} onClick={() => onChangeSemanal('vidros', 'nao')}>
                                        <Typography sx={{ color: isColor(semanal.vidros, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.vidros, 'na', palette.grey['300']) }} onClick={() => onChangeSemanal('vidros', 'na')}>
                                        <Typography sx={{ color: isColor(semanal.vidros, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.vidros, 'sim', palette.success['500']) }} onClick={() => onChangeSemanal('vidros', 'sim')}>
                                        <Typography sx={{ color: isColor(semanal.vidros, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {semanal.vidros === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Vidros - Observações' name='vidros_obs' multiline rows={2} value={semanal.vidros_obs} onChange={(e) => onChangeSemanal('vidros_obs', e.target.value)} />
                                    </Box>
                                )}
                                {semanal.vidros === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadSemanal('vidros_images')} />
                                    </Button>
                                )}
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                    Verificado se existem luzes acessas no painel do veículo antes do serviço?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                    <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.luzes, 'nao', palette.error['600']) }} onClick={() => onChangeSemanal('luzes', 'nao')}>
                                        <Typography sx={{ color: isColor(semanal.luzes, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            NÃO
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.luzes, 'na', palette.grey['300']) }} onClick={() => onChangeSemanal('luzes', 'na')}>
                                        <Typography sx={{ color: isColor(semanal.luzes, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                            N/A
                                        </Typography>
                                    </Button>
                                    <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(semanal.luzes, 'sim', palette.success['500']) }} onClick={() => onChangeSemanal('luzes', 'sim')}>
                                        <Typography sx={{ color: isColor(semanal.luzes, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                            SIM
                                        </Typography>
                                    </Button>
                                </Box>
                                {semanal.luzes === 'nao' && (
                                    <Box sx={{ }}>
                                        <Inputs.TextField label='Luzes - Observações' name='luzes_obs' multiline rows={2} value={semanal.luzes_obs} onChange={(e) => onChangeSemanal('luzes_obs', e.target.value)} />
                                    </Box>
                                )}
                                {semanal.luzes === 'nao' && (
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<Icon icon='solar:download-minimalistic-linear' fontSize={20} />}
                                        sx={{ width: '100%', color: 'white' }}
                                    >
                                        Selecionar até 3 imagens
                                        <Inputs.HiddenInput type='file' multiple accept=".png,.jpg,.jpeg" onChange={onFileUploadSemanal('luzes_images')} />
                                    </Button>
                                )}
                            </Grid2>
                        </Grid2>
                    </LocalizationProvider>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onCancelChecklist} color='error'>Cancelar</Button>
                    <Button color='primary' onClick={onSaveChecklistSemanal}>Finalizar checklist</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}