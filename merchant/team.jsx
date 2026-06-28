// === Team management / role-based access ===
function Team({ ctx }) {
  const toast = useToast();
  const [team, setTeam] = useState(KD.team);
  const [invites, setInvites] = useState(KD.invites);
  const [invite, setInvite] = useState(false);
  const [editUser, setEditUser] = useState(null);

  function addInvite(email, role){
    setInvites(i=>[...i,{id:'i'+Date.now(),email,role,sent:'just now'}]);
    setInvite(false);
    toast('Invite sent to '+email, <IcSend size={14}/>);
  }
  function changeRole(id, role){
    setTeam(t=>t.map(u=>u.id===id?{...u,role}:u));
    setEditUser(null);
    toast('Role updated');
  }

  const roleColor = { 'Owner':'var(--pink)','Marketing':'var(--lime)','Finance':'var(--teal)','Venue Manager':'var(--amber)' };

  return (
    <div className="page">
      <PageHead eyebrow="Role-based access · 4 sites" title="Team">
        <Btn variant="solid" icon={<IcPlus size={16}/>} onClick={()=>setInvite(true)}>Invite member</Btn>
      </PageHead>

      {/* members table */}
      <div className="card card-pad-0 mb24">
        <div className="card-head" style={{padding:'20px 22px 14px',marginBottom:0}}><h3><IcUsers size={17}/> Members <span className="muted" style={{fontWeight:600,fontSize:13}}>· {team.length}</span></h3></div>
        <table className="tbl">
          <thead><tr><th>Member</th><th>Role</th><th>Venue access</th><th>Last active</th><th></th></tr></thead>
          <tbody>
            {team.map(u=>(
              <tr key={u.id}>
                <td><div className="row gap8"><Av init={u.init} color={u.av} size={36}/>
                  <div><div style={{fontWeight:700}}>{u.name}{u.you && <span className="badge soft" style={{marginLeft:8,fontSize:9}}>YOU</span>}</div>
                  <div className="muted" style={{fontSize:12}}>{u.email}</div></div></div></td>
                <td><span className="badge" style={{background:roleColor[u.role],color:'var(--ink)'}}>{u.role}</span></td>
                <td className="muted" style={{fontSize:13,fontWeight:600}}>{u.venues}</td>
                <td className="muted" style={{fontSize:13}}>{u.last}</td>
                <td className="num"><button className="btn ghost sm" disabled={u.you} onClick={()=>setEditUser(u)}><IcEdit size={13}/> Edit</button></td>
              </tr>
            ))}
            {invites.map(i=>(
              <tr key={i.id} style={{opacity:.7}}>
                <td><div className="row gap8"><div style={{width:36,height:36,borderRadius:'50%',border:'1.5px dashed var(--ink)',display:'flex',alignItems:'center',justifyContent:'center'}}><IcSend size={14}/></div>
                  <div><div style={{fontWeight:700}}>{i.email}</div><div className="muted" style={{fontSize:12}}>Invite sent {i.sent}</div></div></div></td>
                <td><span className="badge draft">{i.role}</span></td>
                <td className="muted" style={{fontSize:13}}>—</td>
                <td><span className="badge pending">PENDING</span></td>
                <td className="num"><button className="btn ghost sm" onClick={()=>{setInvites(v=>v.filter(x=>x.id!==i.id));toast('Invite revoked');}}>Revoke</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* permission matrix */}
      <div className="card">
        <div className="card-head"><div><h3><IcShield size={17}/> What each role can do</h3><div className="ch-sub">Permissions are enforced across the whole portal</div></div></div>
        <div style={{overflowX:'auto'}}>
          <table className="tbl" style={{minWidth:640}}>
            <thead><tr><th>Capability</th>{Object.keys(KD.ROLES).map(r=><th key={r} className="num" style={{textAlign:'center'}}>{KD.ROLES[r].label.split(' ')[0]}</th>)}</tr></thead>
            <tbody>
              {[['View dashboard','dashboard'],['Create & edit campaigns','campaigns'],['View analytics','analytics'],['AI insights (Pro)','ai'],['Wallet & budgets','wallet'],['Approve budgets','billing'],['Manage team','team'],['Venue settings','settings']].map(([lab,key])=>(
                <tr key={key}>
                  <td style={{fontWeight:600}}>{lab}</td>
                  {Object.keys(KD.ROLES).map(r=>(
                    <td key={r} className="num" style={{textAlign:'center'}}>
                      {KD.ROLES[r][key] ? <span style={{color:'var(--ok)',display:'inline-flex'}}><IcCheck size={17}/></span> : <span className="muted-2">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {invite && <InviteModal onClose={()=>setInvite(false)} onInvite={addInvite} />}
      {editUser && <EditRoleModal user={editUser} onClose={()=>setEditUser(null)} onSave={changeRole} />}
    </div>
  );
}

function InviteModal({ onClose, onInvite }) {
  const [email,setEmail]=useState('');
  const [role,setRole]=useState('Marketing');
  return (
    <Modal title="Invite a team member" sub="They’ll get an email to set up their account with the access you choose." onClose={onClose}
      foot={<><Btn variant="ghost" onClick={onClose}>Cancel</Btn><Btn variant="lime" disabled={!email.includes('@')} icon={<IcSend size={14}/>} onClick={()=>onInvite(email,role)}>Send invite</Btn></>}>
      <Field label="Email address"><input className="inp" placeholder="name@emberandoak.co.uk" value={email} onChange={e=>setEmail(e.target.value)} /></Field>
      <Field label="Role">
        <div className="col" style={{gap:10}}>
          {Object.keys(KD.ROLES).map(r=><Choice key={r} on={role===r} title={KD.ROLES[r].label} desc={KD.ROLES[r].desc} onClick={()=>setRole(r)} />)}
        </div>
      </Field>
    </Modal>
  );
}

function EditRoleModal({ user, onClose, onSave }) {
  const [role,setRole]=useState(user.role);
  return (
    <Modal title={`Edit ${user.name}`} sub={user.email} onClose={onClose}
      foot={<><Btn variant="ghost" onClick={onClose}>Cancel</Btn><Btn variant="lime" icon={<IcCheck size={15}/>} onClick={()=>onSave(user.id,role)}>Save changes</Btn></>}>
      <Field label="Role">
        <div className="col" style={{gap:10}}>
          {Object.keys(KD.ROLES).map(r=><Choice key={r} on={role===r} title={KD.ROLES[r].label} desc={KD.ROLES[r].desc} onClick={()=>setRole(r)} />)}
        </div>
      </Field>
      <button className="btn ghost sm" style={{color:'var(--bad)',borderColor:'var(--line)'}} onClick={onClose}><IcTrash size={13}/> Remove from team</button>
    </Modal>
  );
}

window.Team = Team;
