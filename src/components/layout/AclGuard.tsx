'use client'

import { createContext, PropsWithChildren, useContext } from "react";
import { createContextualCan } from '@casl/react'
import { AnyAbility, defineAbility } from "@casl/ability";
import User from "@/entities/user.entity";
import AuthRedirect from "./AuthRedirect";

export const defineAbilityFor = (user: User) => defineAbility((can) => {
  can('read', 'home')
  
  if (parseInt(`${user.tipo_acesso}`) === 0) {
    can('manage', 'usuarios')
    can('manage', 'empresas')
    can('manage', 'veiculos')
    can('manage', 'relatorios')
    can('manage', 'checklists')
    can('manage', 'limpezas')
  } else if (parseInt(`${user.tipo_acesso}`) === 1) {
    can('manage', 'lembretes')
    can('manage', 'notificacoes')
    can('manage', 'ocorrencias')
    can('manage', 'inconformidades')
  } else if (parseInt(`${user.tipo_acesso}`) === 2) {
    
  }
  /* if (user.regras) {
    for (const regra of user.regras) {
      can(regra.action, regra.subject)
    }
  } */
})

export const AbilityContext = createContext<AnyAbility>(undefined!)
export const Can = createContextualCan(AbilityContext.Consumer)

export const AclGuard = ({ children, ability }: PropsWithChildren<{ ability: AnyAbility }>) => {
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}

export const Authorized = ({ subject, action, children }: { subject: string, action: string, children: React.ReactNode }) => {
  const ability = useContext(AbilityContext)

  if (ability.can(action, subject)) {
    return <>{children}</>
  }

  return <><AuthRedirect /></>
}

export const useAbility = () => useContext(AbilityContext)